import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { claimSharedInvite, createSharedInvite, fetchParentStatus, migrateLegacyParent, removeChildConnection } from './familyApi';
import { registerParent, validPhone } from './familyDemo';

const colors = { ink: '#101c33', muted: '#657189', blue: '#3159c7', navy: '#12245d', cyan: '#31b9d4', pale: '#edf2ff', page: '#f4f6fb', white: '#fff', line: '#dfe5ef', green: '#119c85', red: '#b43c48' };

function Button({ label, onPress, secondary, disabled, icon }) {
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={({ pressed }) => [s.button, secondary && s.secondary, disabled && s.disabled, pressed && s.pressed]}>
    {disabled ? <ActivityIndicator color={secondary ? colors.navy : colors.white}/> : <>{icon && <Ionicons name={icon} size={18} color={secondary ? colors.navy : colors.white}/>}<Text style={[s.buttonText, secondary && s.secondaryText]}>{label}</Text></>}
  </Pressable>;
}
function Card({ children, style }) { return <View style={[s.card, style]}>{children}</View>; }
function Field({ label, hint, ...props }) { return <View style={s.field}><Text style={s.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#929db0" style={s.input} {...props}/>{hint ? <Text style={s.hint}>{hint}</Text> : null}</View>; }
function ErrorMessage({ children }) { return children ? <View accessibilityRole="alert" style={s.errorBox}><Ionicons name="alert-circle-outline" size={18} color={colors.red}/><Text style={s.error}>{children}</Text></View> : null; }
function BackHeader({ title, subtitle, onBack }) { return <View style={s.header}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={s.back}><Ionicons name="arrow-back" size={22} color={colors.ink}/></Pressable><View style={s.grow}><Text style={s.kicker}>{subtitle}</Text><Text style={s.title}>{title}</Text></View></View>; }
function Progress({ step }) { return <View style={s.progressWrap}><View style={s.progressTrack}><View style={[s.progressFill, { width: step === 1 ? '50%' : '100%' }]}/></View><Text style={s.progressText}>Step {step} of 2</Text></View>; }
function RoleChoice({ icon, title, body, parent, onPress }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [s.roleChoice, parent && s.roleChoiceParent, pressed && s.pressed]}>
    <View style={[s.roleChoiceIcon, parent && s.roleChoiceIconParent]}><Ionicons name={icon} size={27} color={colors.white}/></View>
    <View style={s.grow}><Text style={s.roleChoiceTitle}>{title}</Text><Text style={s.roleChoiceBody}>{body}</Text></View>
    <View style={s.roleChoiceArrow}><Ionicons name="arrow-forward" size={20} color={colors.navy}/></View>
  </Pressable>;
}

export default function FamilyHub({ family, saveFamily, onBack, onRoleChange, onSettings, initialView = 'start' }) {
  const [view, setView] = useState(initialView);
  const [guardianName, setGuardianName] = useState(family.guardianName || '');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [childName, setChildName] = useState(family.childName || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (family.role !== 'parent' || family.parentId || !family.familyId || !family.parentToken) return;
    migrateLegacyParent(family.familyId, family.parentToken).then((parent) => persist({ ...family, parentId: parent.parentId, guardianName: parent.guardianName, children: parent.children || [], connectionMode: 'shared' })).catch(() => {});
  }, [family]);

  function go(next) { setError(''); setView(next); }
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (busy) return true;
      if (view === 'verify') { go('phone'); return true; }
      if (view === 'newInvite' || view === 'invite') { go('dashboard'); return true; }
      if (view === 'connected' || (view === 'join' && family.role === 'child')) { onBack(); return true; }
      if (view === 'dashboard' && family.role === 'parent') return false;
      if (view === 'start') { onBack(); return true; }
      go('start'); return true;
    });
    return () => subscription.remove();
  }, [view, busy, family.role, onBack]);
  async function persist(next, nextView) {
    const saved = await saveFamily(next);
    if (!saved) throw new Error('Could not save this account on the phone. Please try again.');
    if (nextView) setView(nextView);
  }
  function requestCode() {
    if (guardianName.trim().length < 2) return setError('Enter your name to continue.');
    if (!validPhone(phone)) return setError('Enter a phone number with 9–15 digits.');
    go('verify');
  }
  async function verifyParent() {
    const result = registerParent(family, guardianName, phone, otp);
    if (result.error) return setError(result.error);
    setBusy(true);
    try { await persist(result.state, 'dashboard'); setError(''); }
    catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }
  async function generateInvite() {
    if (!childName.trim()) return setError('Enter a child nickname.');
    setBusy(true); setError('');
    try {
      const invite = await createSharedInvite({ guardianName: family.guardianName || guardianName, childName, parentId: family.parentId, parentToken: family.parentToken });
      await persist({ ...family, guardianName: invite.guardianName, parentId: invite.parentId, parentToken: invite.parentToken, pendingInvite: { code: invite.code, childId: invite.childId, childName: invite.childName, expiresAt: invite.expiresAt }, role: 'parent', connectionMode: 'shared' }, 'invite');
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }
  async function connectChild() {
    if (!/^\d{6}$/.test(code.trim())) return setError('Enter the six-digit family code.');
    setBusy(true); setError('');
    try {
      const linked = await claimSharedInvite(code.trim());
      await persist({ ...family, childName: linked.childName, guardianName: linked.guardianName, parentId: linked.parentId, childId: linked.childId, linked: true, linkedAt: linked.linkedAt, role: 'child', connectionMode: 'shared', invite: null, pendingInvite: null }, 'connected');
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }
  const refreshStatus = useCallback(async (quiet = false) => {
    if (!family.parentId || !family.parentToken || family.role !== 'parent') return;
    if (!quiet) setChecking(true);
    try {
      const status = await fetchParentStatus(family.parentId, family.parentToken);
      const children = status.children || [];
      const linkedInvite = family.pendingInvite && children.some((child) => child.id === family.pendingInvite.childId);
      await persist({ ...family, guardianName: status.guardianName || family.guardianName, children, pendingInvite: linkedInvite ? null : family.pendingInvite, role: 'parent', connectionMode: 'shared' }, linkedInvite ? 'dashboard' : undefined);
      if (!quiet) setError('');
    } catch (reason) { if (!quiet) setError(reason.message); }
    finally { if (!quiet) setChecking(false); }
  }, [family]);

  useEffect(() => {
    if (!family.parentId || !family.parentToken || family.role !== 'parent' || !['dashboard', 'invite'].includes(view)) return undefined;
    const timer = setInterval(() => refreshStatus(true), 4000);
    return () => clearInterval(timer);
  }, [family.parentId, family.parentToken, family.role, refreshStatus, view]);

  async function removeChild(childId) {
    setBusy(true); setError('');
    try {
      await removeChildConnection(family.parentId, childId, family.parentToken);
      await persist({ ...family, children: family.children.filter((child) => child.id !== childId) }, 'dashboard');
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  if (view === 'start') return <>
    <BackHeader title="Choose your space" subtitle="FAMILY CONNECTION" onBack={onBack}/>
    <LinearGradient colors={[colors.navy, '#2e55bb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.roleHero}>
      <View style={s.heroIcon}><Ionicons name="shield-checkmark-outline" size={30} color={colors.white}/></View>
      <Text style={s.heroTitle}>Connected, with clear boundaries.</Text>
      <Text style={s.heroBody}>Each phone has its own space. A temporary code is the only thing shared between them.</Text>
    </LinearGradient>
    <Text style={s.rolePrompt}>WHO IS USING THIS PHONE?</Text>
    <RoleChoice parent icon="people-outline" title={family.registered && family.role === 'parent' ? 'Open parent space' : 'Parent or guardian'} body={family.registered && family.role === 'parent' ? 'Manage the family connection from this parent phone.' : 'Create an account, then generate a child connection code.'} onPress={() => { onRoleChange?.('parent'); go(family.registered && family.role === 'parent' ? 'dashboard' : 'phone'); }}/>
    <RoleChoice icon="link-outline" title="Child" body="Use the six-digit code from a trusted parent or guardian." onPress={() => { onRoleChange?.('child'); go('join'); }}/>
    <View style={s.rolePrivacy}><Ionicons name="lock-closed-outline" size={17} color={colors.green}/><Text style={s.rolePrivacyText}>A parent sees the connection state, not private child reports or conversations.</Text></View>
  </>;

  if (view === 'phone') return <>
    <BackHeader title="Create your account" subtitle="PARENT SETUP" onBack={() => go('start')}/><Progress step={1}/>
    <LinearGradient colors={['#eef3ff', '#f8faff']} style={s.formHero}><View style={s.formIcon}><Ionicons name="shield-checkmark-outline" size={28} color={colors.blue}/></View><Text style={s.heading}>A calm place to support your child.</Text><Text style={s.body}>We only need a name and phone number for this hackathon account walkthrough.</Text></LinearGradient>
    <Card style={s.formCard}><Field label="Your name" value={guardianName} onChangeText={setGuardianName} autoCapitalize="words" autoComplete="name" placeholder="e.g. Amina" maxLength={40}/><Field label="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} autoComplete="tel" placeholder="0700 000 000" maxLength={20} hint="Use a test number. The demo does not send an SMS."/><ErrorMessage>{error}</ErrorMessage><Button label="Continue" icon="arrow-forward" onPress={requestCode}/></Card>
    <View style={s.trustRow}><Ionicons name="lock-closed-outline" size={17} color={colors.green}/><Text style={s.trustText}>Only the last four digits are kept on this phone.</Text></View>
  </>;

  if (view === 'verify') return <>
    <BackHeader title="Verify your number" subtitle="PARENT SETUP" onBack={() => go('phone')}/><Progress step={2}/>
    <Card style={s.verifyCard}><View style={s.verifyIcon}><Ionicons name="chatbubble-ellipses-outline" size={29} color={colors.blue}/></View><Text style={[s.heading, s.center]}>Enter the six-digit code</Text><Text style={[s.body, s.center]}>For this demonstration, use the code shown below.</Text><View style={s.demoCode}><Text style={s.demoCodeLabel}>DEMO CODE</Text><Text style={s.demoCodeValue}>123456</Text></View><TextInput accessibilityLabel="Six-digit verification code" keyboardType="number-pad" value={otp} onChangeText={setOtp} placeholder="000000" placeholderTextColor="#a1aabc" maxLength={6} style={s.otpInput}/><ErrorMessage>{error}</ErrorMessage><Button disabled={busy} label="Create account" icon="checkmark" onPress={verifyParent}/></Card>
  </>;

  if (view === 'dashboard') return <>
    <BackHeader title="Family dashboard" subtitle={family.guardianName ? `WELCOME, ${family.guardianName.toUpperCase()}` : 'PARENT SPACE'} onBack={onBack}/>
    <LinearGradient colors={[colors.navy, '#254aab']} style={s.dashboardHero}><View style={s.statusTop}><View style={s.profileCircle}><Text style={s.profileInitial}>{(family.guardianName || 'P').charAt(0).toUpperCase()}</Text></View><View style={s.grow}><Text style={s.dashboardTitle}>{family.children.length} {family.children.length === 1 ? 'child device' : 'child devices'} connected</Text><View style={s.statusLine}><View style={[s.statusDot, family.children.length > 0 && s.statusDotOn]}/><Text style={s.statusText}>Your parent account only shows family connection and safety-summary information.</Text></View></View></View><Button label="Add a child device" icon="person-add-outline" onPress={() => go('newInvite')}/></LinearGradient>
    <View style={s.summaryRow}><Card style={s.summaryCard}><Ionicons name="phone-portrait-outline" size={23} color={colors.blue}/><Text style={s.summaryValue}>{family.children.length}</Text><Text style={s.summaryLabel}>Connected children</Text></Card><Card style={s.summaryCard}><Ionicons name="flag-outline" size={23} color={colors.blue}/><Text style={s.summaryValue}>{family.children.reduce((total, child) => total + Number(child.incidents || 0), 0)}</Text><Text style={s.summaryLabel}>Flagged incidents</Text></Card></View>
    <Card><View style={s.listTitleRow}><View><Text style={s.headingSmall}>Child devices</Text><Text style={s.body}>Connected phones in this family.</Text></View><Pressable accessibilityRole="button" onPress={() => refreshStatus(false)} style={s.refreshIcon}>{checking ? <ActivityIndicator size="small" color={colors.blue}/> : <Ionicons name="refresh-outline" size={20} color={colors.blue}/>}</Pressable></View>{family.children.length ? family.children.map((child) => <View key={child.id} style={s.childRow}><View style={s.childInitial}><Text style={s.childInitialText}>{child.name.charAt(0).toUpperCase()}</Text></View><View style={s.grow}><Text style={s.childRowName}>{child.name}</Text><Text style={s.childRowMeta}>{child.incidents || 0} flagged incidents · Connected</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`Remove ${child.name}`} disabled={busy} onPress={() => removeChild(child.id)} style={s.removeChild}><Ionicons name="close" size={18} color={colors.red}/></Pressable></View>) : <View style={s.emptyChildren}><Ionicons name="people-outline" size={27} color={colors.blue}/><Text style={s.emptyChildrenTitle}>No child phones connected yet</Text><Text style={s.body}>Create a one-time code to connect the first child device.</Text></View>}<ErrorMessage>{error}</ErrorMessage></Card>
    <Card><Text style={s.headingSmall}>Protection preferences</Text><Text style={s.body}>Prepare the categories that matter to your family. Filtering is not active yet.</Text><Button secondary label="Open preferences" icon="options-outline" onPress={onSettings}/></Card>
  </>;

  if (view === 'newInvite') return <>
    <BackHeader title="Link a child" subtitle="PARENT SPACE" onBack={() => go('dashboard')}/>
    <Card><View style={s.formIcon}><Ionicons name="person-add-outline" size={27} color={colors.blue}/></View><Text style={s.heading}>Who are you connecting?</Text><Text style={s.body}>Use a nickname. The family code will expire after ten minutes and can be used once.</Text><Field label="Child nickname" value={childName} onChangeText={setChildName} placeholder="e.g. Kato" maxLength={40}/><ErrorMessage>{error}</ErrorMessage><Button disabled={busy} label="Create family code" icon="key-outline" onPress={generateInvite}/></Card>
  </>;

  if (view === 'invite') return <>
    <BackHeader title="Your family code" subtitle="CONNECT THE CHILD PHONE" onBack={() => go('dashboard')}/>
    <LinearGradient colors={['#eaf0ff', '#f8faff']} style={s.codeCard}><Ionicons name="link-outline" size={28} color={colors.blue}/><Text style={s.codeFor}>FOR {family.pendingInvite?.childName?.toUpperCase()}</Text><View style={s.codeRow}>{String(family.pendingInvite?.code || '').split('').map((digit, index) => <View key={`${digit}-${index}`} style={s.codeDigit}><Text style={s.codeDigitText}>{digit}</Text></View>)}</View><Text style={s.body}>Open Chinga on the child’s phone, choose “Connect with family code,” and enter these digits.</Text><Text style={s.expiry}>Expires {family.pendingInvite?.expiresAt ? new Date(family.pendingInvite.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'in 10 minutes'}</Text></LinearGradient>
    <Card><View style={s.waitingRow}><ActivityIndicator color={colors.blue}/><View style={s.grow}><Text style={s.headingSmall}>Waiting for the child phone</Text><Text style={s.body}>This page checks the shared service every few seconds.</Text></View></View><Button secondary disabled={checking} label="Check now" icon="refresh-outline" onPress={() => refreshStatus(false)}/><Button secondary label="Add another child instead" icon="person-add-outline" onPress={() => go('newInvite')}/><ErrorMessage>{error}</ErrorMessage></Card>
  </>;

  if (view === 'join') return <>
    <BackHeader title="Connect to family" subtitle="CHILD SETUP" onBack={() => go('start')}/>
    <LinearGradient colors={[colors.navy, '#2b56bf']} style={s.joinHero}><View style={s.heroIcon}><Ionicons name="link-outline" size={30} color={colors.white}/></View><Text style={s.heroTitle}>Enter the code from your trusted guardian.</Text><Text style={s.heroBody}>The code works once and expires after ten minutes.</Text></LinearGradient>
    <Card style={s.joinCard}><Text style={s.fieldLabel}>Six-digit family code</Text><TextInput accessibilityLabel="Family code" value={code} onChangeText={(value) => setCode(value.replace(/\D/g, ''))} keyboardType="number-pad" placeholder="000000" placeholderTextColor="#a1aabc" maxLength={6} style={s.familyCodeInput}/><ErrorMessage>{error}</ErrorMessage><Button disabled={busy} label="Connect this phone" icon="link-outline" onPress={connectChild}/><Text style={s.hint}>You need an internet connection while the two phones link.</Text></Card>
  </>;

  if (view === 'connected') return <>
    <BackHeader title="Family connected" subtitle="CONNECTION COMPLETE" onBack={onBack}/>
    <LinearGradient colors={['#e9fbf7', '#f8fffd']} style={s.successCard}><View style={s.successIcon}><Ionicons name="checkmark" size={34} color={colors.white}/></View><Text style={[s.heading, s.center]}>You’re connected to {family.guardianName}.</Text><Text style={[s.body, s.center]}>Your family can see that this phone is connected. Private messages and report drafts are not shared.</Text><Button label="Go to child home" icon="arrow-forward" onPress={onBack}/></LinearGradient>
  </>;

  return null;
}

const s = StyleSheet.create({
  grow:{flex:1}, header:{flexDirection:'row',alignItems:'center',gap:13,marginBottom:22},back:{width:44,height:44,borderRadius:22,backgroundColor:colors.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line},kicker:{fontSize:10,fontWeight:'800',letterSpacing:1.1,color:colors.blue,marginBottom:5},title:{fontSize:29,fontWeight:'900',letterSpacing:-1.1,color:colors.ink},
  card:{padding:21,borderRadius:22,backgroundColor:colors.white,borderWidth:1,borderColor:'#e5e9f1',marginBottom:14},heading:{fontSize:24,lineHeight:30,fontWeight:'900',letterSpacing:-.7,color:colors.ink,marginBottom:9},headingSmall:{fontSize:17,fontWeight:'800',color:colors.ink,marginBottom:6},body:{fontSize:14,lineHeight:21,color:colors.muted},center:{textAlign:'center'},choiceNumber:{fontSize:11,fontWeight:'900',letterSpacing:1.2,color:colors.blue,marginBottom:17},
  button:{minHeight:54,borderRadius:17,backgroundColor:colors.navy,justifyContent:'center',alignItems:'center',flexDirection:'row',gap:9,marginTop:16,paddingHorizontal:18},secondary:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.line},buttonText:{color:colors.white,fontWeight:'800',fontSize:14},secondaryText:{color:colors.navy},disabled:{opacity:.55},pressed:{opacity:.78},
  roleHero:{borderRadius:26,padding:24,minHeight:210,justifyContent:'flex-end',marginBottom:21,overflow:'hidden'},heroIcon:{width:54,height:54,borderRadius:18,backgroundColor:'#ffffff1f',alignItems:'center',justifyContent:'center',marginBottom:24,borderWidth:1,borderColor:'#ffffff24'},heroTitle:{fontSize:29,lineHeight:34,fontWeight:'900',letterSpacing:-1,color:colors.white,marginBottom:8},heroBody:{fontSize:14,lineHeight:21,color:'#d7e2ff'},rolePrompt:{fontSize:10,fontWeight:'800',letterSpacing:1.15,color:colors.blue,marginBottom:10},roleChoice:{minHeight:112,borderRadius:22,borderWidth:1,borderColor:'#e0e5ee',backgroundColor:colors.white,flexDirection:'row',alignItems:'center',padding:16,marginBottom:13,gap:14,shadowColor:'#152553',shadowOpacity:.07,shadowRadius:10,shadowOffset:{width:0,height:4},elevation:3},roleChoiceParent:{borderColor:'#cbd7f5',backgroundColor:'#f8faff'},roleChoiceIcon:{width:54,height:54,borderRadius:18,backgroundColor:'#6756c9',alignItems:'center',justifyContent:'center'},roleChoiceIconParent:{backgroundColor:colors.blue},roleChoiceTitle:{fontSize:19,fontWeight:'800',letterSpacing:-.4,color:colors.ink,marginBottom:4},roleChoiceBody:{fontSize:13,lineHeight:19,color:colors.muted},roleChoiceArrow:{width:37,height:37,borderRadius:19,backgroundColor:'#eff3ff',alignItems:'center',justifyContent:'center'},rolePrivacy:{flexDirection:'row',gap:9,alignItems:'flex-start',padding:13,borderRadius:15,backgroundColor:'#edf9f6',marginTop:2},rolePrivacyText:{flex:1,fontSize:12,lineHeight:18,color:'#467369'},
  progressWrap:{marginBottom:18},progressTrack:{height:5,borderRadius:4,backgroundColor:'#dfe5f1',overflow:'hidden'},progressFill:{height:5,backgroundColor:colors.blue,borderRadius:4},progressText:{fontSize:11,fontWeight:'700',color:colors.muted,marginTop:7,textAlign:'right'},formHero:{padding:21,borderRadius:22,marginBottom:14},formIcon:{width:52,height:52,borderRadius:16,backgroundColor:'#dce6ff',alignItems:'center',justifyContent:'center',marginBottom:18},formCard:{paddingTop:8},field:{marginTop:16},fieldLabel:{fontSize:13,fontWeight:'800',color:colors.ink,marginBottom:8},input:{height:54,borderWidth:1,borderColor:colors.line,borderRadius:15,paddingHorizontal:15,fontSize:16,color:colors.ink,backgroundColor:'#fbfcfe'},hint:{fontSize:11,lineHeight:17,color:colors.muted,marginTop:7},
  errorBox:{flexDirection:'row',gap:8,alignItems:'flex-start',padding:12,borderRadius:13,backgroundColor:'#fff0f1',marginTop:14},error:{flex:1,color:colors.red,fontSize:12,lineHeight:18},trustRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:8},trustText:{fontSize:12,color:colors.muted},
  verifyCard:{paddingTop:26},verifyIcon:{width:58,height:58,borderRadius:19,backgroundColor:colors.pale,alignSelf:'center',alignItems:'center',justifyContent:'center',marginBottom:17},demoCode:{alignSelf:'center',alignItems:'center',marginVertical:22,paddingHorizontal:22,paddingVertical:12,borderRadius:15,backgroundColor:'#edf8f6'},demoCodeLabel:{fontSize:9,fontWeight:'900',letterSpacing:1.2,color:colors.green},demoCodeValue:{fontSize:22,fontWeight:'900',letterSpacing:4,color:colors.ink,marginTop:4},otpInput:{height:64,borderWidth:1.5,borderColor:'#bdcbea',borderRadius:17,textAlign:'center',fontSize:28,fontWeight:'800',letterSpacing:10,color:colors.ink,backgroundColor:'#fafcff'},
  dashboardHero:{borderRadius:26,padding:22,marginBottom:14},statusTop:{flexDirection:'row',alignItems:'center',gap:14},profileCircle:{width:52,height:52,borderRadius:26,backgroundColor:colors.white,alignItems:'center',justifyContent:'center'},profileInitial:{fontSize:20,fontWeight:'900',color:colors.blue},dashboardTitle:{fontSize:22,fontWeight:'900',color:colors.white,marginBottom:6},statusLine:{flexDirection:'row',alignItems:'center',gap:7},statusDot:{width:8,height:8,borderRadius:4,backgroundColor:'#efbb65'},statusDotOn:{backgroundColor:'#47d7bd'},statusText:{flex:1,fontSize:11,lineHeight:16,color:'#dce6ff'},summaryRow:{flexDirection:'row',gap:12},summaryCard:{flex:1},summaryValue:{fontSize:21,fontWeight:'900',color:colors.ink,marginTop:13},summaryLabel:{fontSize:11,color:colors.muted,marginTop:4},listTitleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16},refreshIcon:{width:42,height:42,borderRadius:21,backgroundColor:colors.pale,alignItems:'center',justifyContent:'center'},childRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:13,borderTopWidth:1,borderTopColor:'#edf0f5'},childInitial:{width:39,height:39,borderRadius:13,backgroundColor:'#dfe8ff',alignItems:'center',justifyContent:'center'},childInitialText:{fontSize:15,fontWeight:'900',color:colors.blue},childRowName:{fontSize:15,fontWeight:'800',color:colors.ink,marginBottom:3},childRowMeta:{fontSize:11,color:colors.muted},removeChild:{width:38,height:38,borderRadius:19,backgroundColor:'#fff1f2',alignItems:'center',justifyContent:'center'},emptyChildren:{alignItems:'center',paddingVertical:18},emptyChildrenTitle:{fontSize:15,fontWeight:'800',color:colors.ink,marginTop:10,marginBottom:5},
  codeCard:{borderRadius:26,padding:23,marginBottom:14,alignItems:'center'},codeFor:{fontSize:10,fontWeight:'900',letterSpacing:1.1,color:colors.blue,marginTop:15},codeRow:{flexDirection:'row',gap:6,marginVertical:22},codeDigit:{width:40,height:54,borderRadius:13,backgroundColor:colors.white,borderWidth:1,borderColor:'#cdd8ee',alignItems:'center',justifyContent:'center'},codeDigitText:{fontSize:24,fontWeight:'900',color:colors.ink},expiry:{fontSize:11,fontWeight:'800',color:colors.blue,marginTop:15},waitingRow:{flexDirection:'row',alignItems:'center',gap:14},
  joinHero:{borderRadius:26,padding:24,minHeight:225,justifyContent:'flex-end',marginBottom:-22,zIndex:0},joinCard:{marginHorizontal:8,zIndex:1},familyCodeInput:{height:68,borderWidth:1.5,borderColor:'#bdcbea',borderRadius:18,textAlign:'center',fontSize:30,fontWeight:'900',letterSpacing:11,color:colors.ink,backgroundColor:'#fafcff'},
  successCard:{borderRadius:26,padding:25,alignItems:'center'},successIcon:{width:66,height:66,borderRadius:33,backgroundColor:colors.green,alignItems:'center',justifyContent:'center',marginBottom:20}
});
