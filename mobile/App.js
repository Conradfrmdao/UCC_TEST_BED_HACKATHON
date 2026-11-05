import { useEffect, useState } from 'react';
import { Alert, BackHandler, Image, Linking, Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { NavigationBar } from 'expo-navigation-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { analyseExample, examples } from './src/demo';
import FamilyHub from './src/FamilyHub';
import ChildHome from './src/ChildHome';
import BottomNav from './src/BottomNav';
import { addDemoAlert, emptyFamily } from './src/familyDemo';

const C = { ink: '#142334', muted: '#5e7083', blue: '#1c4f81', navy: '#102e50', pale: '#e7f0fa', page: '#f4f6f8', white: '#fff', line: '#dce4ec' };

function Button({ children, onPress, secondary, disabled }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.buttonSecondary, disabled && s.disabled, pressed && s.pressed]}><Text style={[s.buttonText, secondary && s.buttonTextSecondary]}>{children}</Text></Pressable>;
}
function Card({ children, style }) { return <View style={[s.card, style]}>{children}</View>; }
function Label({ children }) { return <Text style={s.label}>{children}</Text>; }
function Body({ children, style }) { return <Text style={[s.body, style]}>{children}</Text>; }
function Header({ title, onBack }) { return <View style={s.screenHeader}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={s.back}><Ionicons name="arrow-back" size={22} color={C.ink}/></Pressable><View style={s.flex}><Label>CHINGA / DEMO</Label><Text style={s.screenTitle}>{title}</Text></View></View>; }
function WelcomeChoice({ icon, title, body, accent, onPress }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [s.welcomeChoice, pressed && s.pressed]}>
    <View style={[s.welcomeChoiceIcon, accent && s.welcomeChoiceIconAccent]}><Ionicons name={icon} size={28} color={C.white}/></View>
    <View style={s.flex}><Text style={s.welcomeChoiceTitle}>{title}</Text><Text style={s.welcomeChoiceBody}>{body}</Text></View>
    <View style={s.welcomeChoiceArrow}><Ionicons name="arrow-forward" size={21} color="#20377d"/></View>
  </Pressable>;
}
function Skeleton({ style }) { return <View style={[s.skeleton, style]}/>; }
function WelcomeSkeleton({ bottomInset }) {
  return <SafeAreaView style={s.loadingSafe} edges={['top', 'left', 'right']}><StatusBar barStyle="light-content" backgroundColor="#11245f"/><View style={s.loadingHero}><View style={s.loadingTop}><Skeleton style={s.skeletonBrand}/><Skeleton style={s.skeletonPill}/></View><Skeleton style={s.skeletonArtwork}/></View><View style={[s.loadingSheet, { paddingBottom: Math.max(bottomInset, 20) + 20 }]}><Skeleton style={s.skeletonTitle}/><Skeleton style={s.skeletonBody}/><Skeleton style={s.skeletonBodyShort}/><Skeleton style={s.skeletonChoice}/><Skeleton style={s.skeletonChoice}/><Skeleton style={s.skeletonChoice}/></View></SafeAreaView>;
}

export default function App() {
  return <SafeAreaProvider><NavigationBar style="dark"/><AppContent/></SafeAreaProvider>;
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState('welcome');
  const [familyEntry, setFamilyEntry] = useState('start');
  const [familyReturn, setFamilyReturn] = useState('welcome');
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [result, setResult] = useState(null);
  const [report, setReport] = useState('');
  const [preview, setPreview] = useState(false);
  const [privateReport, setPrivateReport] = useState(true);
  const [family, setFamily] = useState(emptyFamily);
  const [familyReady, setFamilyReady] = useState(false);
  const [preferences, setPreferences] = useState({ fraud: true, gambling: false, adult: false });
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem('chinga-family-demo-v1').then((value) => {
      if (!active) return;
      if (value) {
        const saved = JSON.parse(value);
        if (saved && typeof saved === 'object') {
          const role = saved.role || (saved.registered ? 'parent' : saved.linked ? 'child' : '');
          setFamily({ ...emptyFamily(), ...saved, role, alerts: Array.isArray(saved.alerts) ? saved.alerts : [], children: Array.isArray(saved.children) ? saved.children : [] });
          if (role === 'parent' && saved.registered) { setFamilyEntry('dashboard'); setFamilyReturn('welcome'); setScreen('family'); }
          else if (role === 'child') setScreen('home');
        }
      }
    }).catch(() => { if (active) setStorageError(true); }).finally(() => { if (active) setFamilyReady(true); });
    return () => { active = false; };
  }, []);

  async function saveFamily(next) {
    try { await AsyncStorage.setItem('chinga-family-demo-v1', JSON.stringify(next)); setFamily(next); setStorageError(false); return true; }
    catch { setStorageError(true); return false; }
  }

  async function checkMessage() {
    const outcome = screenshot ? { risk: 'unknown', title: 'We cannot check this yet.', explanation: 'Screenshot analysis is not connected. This image has not been analysed or uploaded.', actions: ['Do not share passwords, PINs or one-time codes.', 'Ask a trusted adult for help if it is safe.'] } : analyseExample(message);
    setResult(outcome);
    const nextFamily = addDemoAlert(family, outcome.risk);
    if (nextFamily !== family) await saveFamily(nextFamily);
  }

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem('chinga-protection-preferences-v1').then((value) => {
      if (!active || !value) return;
      const saved = JSON.parse(value);
      if (saved && typeof saved === 'object') setPreferences((current) => Object.fromEntries(Object.keys(current).map((key) => [key, typeof saved[key] === 'boolean' ? saved[key] : current[key]])));
    }).catch(() => { if (active) setStorageError(true); });
    return () => { active = false; };
  }, []);

  async function savePreferences(value) {
    setPreferences(value);
    try { await AsyncStorage.setItem('chinga-protection-preferences-v1', JSON.stringify(value)); setStorageError(false); }
    catch { setStorageError(true); }
  }

  async function chooseScreenshot() {
    try {
      const selection = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!selection.canceled) setScreenshot(selection.assets[0]);
    } catch {
      Alert.alert('Cannot open photos', 'Please try choosing the screenshot again.');
    }
  }
  async function openHelpline() {
    try { await Linking.openURL('tel:116'); }
    catch { Alert.alert('Unable to open the dialler', 'You can dial 116 directly from your phone.'); }
  }
  function navigate(next) { setResult(null); setPreview(false); if (family.role === 'parent' && ['home','check','report','history','help','guidance'].includes(next)) { setFamilyEntry('dashboard'); setScreen('family'); return; } setScreen(next); }
  function openFamily(entry = 'start', returnTo = screen === 'home' ? 'home' : 'welcome') { if (family.role === 'parent' && family.registered) { entry = 'dashboard'; returnTo = 'welcome'; } else if (family.role === 'child') { entry = 'join'; returnTo = 'home'; } setFamilyEntry(entry); setFamilyReturn(returnTo); navigate('family'); }
  function setFamilyDestination(role) { setFamilyReturn(role === 'parent' ? 'welcome' : 'home'); }
  function navigateBottom(next) { if (next === 'family') openFamily('start', 'home'); else navigate(next); }
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'welcome' && !result && !preview) return false;
      if (result) setResult(null);
      else if (preview) setPreview(false);
      else if (screen === 'family' && family.role === 'parent') return false;
      else if (screen === 'family') setScreen(family.role === 'child' ? 'home' : familyReturn);
      else if (['signin', 'privacy'].includes(screen)) setScreen('welcome');
      else if (family.role === 'parent') { setFamilyEntry('dashboard'); setScreen('family'); }
      else setScreen('home');
      return true;
    });
    return () => sub.remove();
  }, [screen, result, preview, familyReturn, family.role]);

  if (!familyReady) return <WelcomeSkeleton bottomInset={insets.bottom}/>;

  const navVisible = family.role !== 'parent' && ['home', 'check', 'report', 'help', 'guidance', 'history', 'settings'].includes(screen);
  const darkChrome = screen === 'home' || screen === 'welcome';
  return <SafeAreaView style={[s.safe, darkChrome && s.safeDark]} edges={['top', 'left', 'right']}><StatusBar barStyle={darkChrome ? 'light-content' : 'dark-content'} backgroundColor={darkChrome ? '#11245f' : C.page}/><ScrollView style={[s.scroll, screen === 'welcome' && s.welcomeScroll]} keyboardShouldPersistTaps="handled" contentContainerStyle={[s.content, screen === 'welcome' && [s.welcomeContent, { paddingBottom: Math.max(insets.bottom, 18) + 18 }]]}>
    {screen === 'welcome' && <>
      <View style={s.welcomeHero}><View style={s.welcomeTop}><View style={s.welcomeBrandRow}><View style={s.welcomeBrandMark}><Ionicons name="shield-checkmark-outline" size={27} color={C.white}/></View><Text style={s.welcomeBrand}>Chinga</Text></View><View style={s.welcomeRegion}><Ionicons name="globe-outline" size={16} color="#dbe5ff"/><Text style={s.welcomeRegionText}>UG · English</Text></View></View><Image source={require('./assets/illustrations/family-safety-welcome-v1.png')} style={s.welcomeArtwork} resizeMode="cover" accessibilityLabel="A family learning safe online habits together"/></View>
      <View style={s.welcomeSheet}><Text style={s.welcomeTitle}>Stay safer online.</Text><Text style={s.welcomeSubtitle}>Protect, guide, and support your child’s online journey with Chinga.</Text><WelcomeChoice icon="people-outline" accent title={family.registered && family.role === 'parent' ? 'Open parent space' : 'Create parent account'} body={family.registered && family.role === 'parent' ? 'Continue managing your family connection.' : 'Set up protection and connect a child device.'} onPress={() => openFamily(family.registered && family.role === 'parent' ? 'dashboard' : 'phone', 'welcome')}/><WelcomeChoice icon="link-outline" title="Connect as a child" body="Join a family with a six-digit parent code." onPress={() => openFamily('join', 'home')}/><WelcomeChoice icon="log-in-outline" title="Sign in" body="Return to an account already saved on this phone." onPress={() => navigate('signin')}/><Pressable accessibilityRole="button" onPress={() => navigate('help')} style={s.welcomeHelp}><Ionicons name="help-circle-outline" size={24} color="#23469a"/><Text style={s.welcomeHelpText}>Basic safety help</Text></Pressable><Text style={s.welcomeFootnote}>Demo verification code: 123456 · Family connection requires internet.</Text></View>
    </>}
    {screen === 'signin' && <><Header title="Sign in" onBack={() => navigate('welcome')}/><Card><Label>DEVELOPMENT MODE</Label><Text style={s.cardHeading}>Real sign-in is not connected yet.</Text><Body>Authentication will be enabled when the shared backend is ready. This demo stores only local walkthrough data on this phone.</Body>{family.registered && <Button onPress={() => openFamily('dashboard')}>Open saved parent demo</Button>}<Button secondary onPress={() => openFamily('phone')}>Create parent demo</Button></Card></>}
    {screen === 'privacy' && <><Header title="Privacy in this demo" onBack={() => navigate('welcome')}/><Card><Text style={s.cardHeading}>Know what stays on your phone.</Text><Body>Family walkthrough data and protection preferences are saved locally. Screenshots are previewed on your device and are not uploaded. Report drafts are not sent. The parent view does not receive private child conversations.</Body></Card><Card><Text style={s.sectionTitle}>Before public use</Text><Body>Real accounts, consent, secure storage, deletion, safeguarding review, role-based access and approved referral procedures still need to be connected and tested.</Body></Card></>}
    {screen === 'home' && <ChildHome family={family} navigate={navigate} openFamily={(entry) => openFamily(entry, 'home')} openHelpline={openHelpline}/>} 
    {screen === 'check' && <><Header title={result ? 'Your result' : 'Is this safe?'} onBack={() => result ? setResult(null) : navigate('home')}/>{result ? <>
      <Card style={result.risk === 'unknown' ? s.neutralResult : s.warningResult}><Label>{result.risk === 'unknown' ? 'CHECKING UNAVAILABLE' : 'SAMPLE DEMONSTRATION'}</Label><Text style={s.cardHeading}>{result.title}</Text><Body>{result.explanation}</Body></Card>
      <Card><Text style={s.sectionTitle}>What you can do</Text>{result.actions.map((action, i) => <View key={action} style={s.step}><Text style={s.stepNumber}>{i + 1}</Text><Body style={s.flex}>{action}</Body></View>)}</Card><Button onPress={() => { setResult(null); setMessage(''); }}>Check another message</Button>
    </> : <><Card><Body>Paste a message or link. We never open links for you.</Body><Text style={s.fieldLabel}>Message or link</Text><TextInput accessibilityLabel="Message or link" style={s.textArea} value={message} onChangeText={setMessage} multiline textAlignVertical="top" placeholder="Paste it here…" placeholderTextColor="#8a99a7"/><Text style={s.caption}>Do not include passwords, PINs or one-time codes.</Text><Pressable accessibilityRole="button" onPress={chooseScreenshot} style={s.upload}><Text style={s.link}>{screenshot ? 'Change screenshot' : 'Add a screenshot'}</Text><Text style={s.caption}>{screenshot ? 'Selected on this device only' : 'Choose an image from your phone'}</Text></Pressable>{screenshot && <><Image source={{ uri: screenshot.uri }} style={s.screenshot} resizeMode="contain"/><Pressable accessibilityRole="button" onPress={() => setScreenshot(null)} style={s.textAction}><Text style={s.link}>Remove image</Text></Pressable></>}<Text style={s.caption}>Screenshot analysis is not connected; images are not uploaded.</Text><Text style={s.fieldLabel}>Try a sample</Text><View style={s.sampleRow}>{examples.map((item) => <Pressable key={item.id} accessibilityRole="button" onPress={() => setMessage(item.text)} style={s.sample}><Text style={s.sampleText}>{item.label}</Text></Pressable>)}</View><Button disabled={!message.trim() && !screenshot} onPress={checkMessage}>Check message</Button><Text style={s.caption}>Only the exact samples have demo results. A live checker is not connected.</Text></Card></>}</>}
    {screen === 'report' && <><Header title={preview ? 'Your preview' : 'Something happened'} onBack={() => preview ? setPreview(false) : navigate('home')}/>{preview ? <><Card><Label>NOT SENT OR SAVED</Label><Text style={s.cardHeading}>Thank you for telling us.</Text><Body>This is a preview on your device. No report or message has been sent to anyone.</Body><View style={s.quote}><Text style={s.quoteText}>{report}</Text></View><Body>Privacy choice: {privateReport ? 'Keep from guardian' : 'No confidentiality choice selected'} (demo only).</Body></Card><Button secondary onPress={() => setPreview(false)}>Edit what I wrote</Button><Button onPress={() => { setReport(''); navigate('home'); }}>Done</Button></> : <Card><Text style={s.cardHeading}>You are not in trouble.</Text><Body>Share only what feels safe. Never type your PIN, password or a security code.</Body><Text style={s.fieldLabel}>What happened?</Text><TextInput accessibilityLabel="What happened?" value={report} onChangeText={setReport} multiline textAlignVertical="top" style={s.textArea} placeholder="Tell us in your own words…" placeholderTextColor="#8a99a7"/><View style={s.switchRow}><View style={s.flex}><Text style={s.strong}>Keep this private from my guardian</Text><Text style={s.caption}>This choice is a preview; no report is sent.</Text></View><Switch accessibilityLabel="Keep report private from guardian" value={privateReport} onValueChange={setPrivateReport} trackColor={{ true: C.blue }}/></View><Button disabled={report.trim().length < 10} onPress={() => setPreview(true)}>Preview</Button><Text style={s.caption}>Your words remain in this screen and disappear when the app closes. This does not contact an authority.</Text></Card>}</>}
    {screen === 'help' && <><Header title="Talk to someone" onBack={() => navigate('home')}/><Card><Label>UGANDA CHILD HELPLINE</Label><Text style={s.cardHeading}>You don't have to handle this alone.</Text><Body>If something online is worrying you, consider talking to a trusted adult if it is safe. You can also call Sauti 116 for support.</Body><Button onPress={openHelpline}>Open phone dialler · 116</Button><Text style={s.caption}>This opens your phone app. No call is placed until you choose to call.</Text><Button secondary onPress={() => navigate('guidance')}>See safety steps</Button></Card></>}
    {screen === 'guidance' && <><Header title="Safety steps" onBack={() => navigate('help')}/><Card><Label>IF SOMETHING FEELS WRONG</Label><Text style={s.cardHeading}>Take it one step at a time.</Text>{['Stop replying or sending money.', 'Do not share your PIN, password or one-time codes.', 'If you already shared a password, use the official app or website to change it.', 'Save the message only if it is safe to do so, and ask a trusted adult for help.'].map((step, index) => <View key={step} style={s.step}><Text style={s.stepNumber}>{index + 1}</Text><Body style={s.flex}>{step}</Body></View>)}<Button secondary onPress={openHelpline}>Open dialler for 116</Button><Text style={s.caption}>This is general guidance, not a live conversation or emergency response.</Text></Card></>}
    {screen === 'history' && <><Header title="Safety history" onBack={() => navigate('home')}/><Card><View style={s.emptyIcon}><Ionicons name="time-outline" size={28} color={C.blue}/></View><Text style={s.cardHeading}>No saved checks yet.</Text><Body>Demo checks are not uploaded or saved to an account. When the backend is connected, reviewed history can appear here.</Body><Button onPress={() => navigate('check')}>Check something now</Button></Card></>}
    {(screen === 'family' || screen === 'guardian') && (familyReady ? <FamilyHub key={`${screen}-${familyEntry}`} family={family} saveFamily={saveFamily} onBack={() => navigate(screen === 'guardian' ? 'home' : familyReturn)} onRoleChange={setFamilyDestination} onSettings={() => navigate('settings')} initialView={screen === 'guardian' ? 'dashboard' : familyEntry}/> : <Text style={s.caption}>Loading family connection…</Text>)}
    {screen === 'settings' && <><Header title="Protection preferences" onBack={() => navigate('home')}/><Card><Label>PREPARATION MODE</Label><Text style={s.cardHeading}>Choose what matters to your family</Text><Body>These preferences are saved on this phone. Android filtering is not active yet.</Body>{[['fraud', 'Fraud and phishing'], ['gambling', 'Gambling'], ['adult', 'Adult content']].map(([key, label]) => <View key={key} style={s.switchRow}><Text style={[s.strong, s.flex]}>{label}</Text><Switch accessibilityLabel={label} value={preferences[key]} onValueChange={(value) => savePreferences({ ...preferences, [key]: value })} trackColor={{ false: '#c9d1dc', true: C.blue }} thumbColor="#fff"/></View>)}<Text style={s.caption}>Support services and educational resources need reviewed exceptions before filtering is introduced.</Text></Card></>}
    {storageError && screen === 'settings' && <Text style={s.caption}>Preferences could not be saved on this device.</Text>}
  </ScrollView>{navVisible && <BottomNav current={screen} navigate={navigateBottom} bottomInset={insets.bottom}/>}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.page},safeDark:{backgroundColor:'#11245f'},scroll:{flex:1,backgroundColor:C.page},welcomeScroll:{backgroundColor:'#11245f'},content:{paddingHorizontal:20,paddingTop:12,paddingBottom:28,flexGrow:1},welcomeContent:{paddingHorizontal:0,paddingTop:0,backgroundColor:'#11245f'},flex:{flex:1},
  top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:23,borderBottomWidth:1,borderBottomColor:C.line}, brand:{fontSize:29,fontWeight:'900',letterSpacing:-1.8,color:C.ink}, brandDot:{color:C.blue}, brandSub:{color:C.muted,fontSize:12,marginTop:1}, topLink:{color:C.blue,fontWeight:'700',fontSize:13},
  welcomeHero:{backgroundColor:'#11245f',paddingTop:13,overflow:'hidden'},welcomeTop:{paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',zIndex:1},welcomeBrandRow:{flexDirection:'row',alignItems:'center'},welcomeBrandMark:{width:42,height:42,borderRadius:15,borderWidth:1,borderColor:'#ffffff43',backgroundColor:'#ffffff18',alignItems:'center',justifyContent:'center'},welcomeBrand:{fontSize:30,fontWeight:'900',letterSpacing:-1,color:C.white,marginLeft:10},welcomeRegion:{flexDirection:'row',alignItems:'center',gap:6,borderRadius:22,backgroundColor:'#ffffff18',borderWidth:1,borderColor:'#ffffff1f',paddingHorizontal:11,paddingVertical:8},welcomeRegionText:{fontSize:11,fontWeight:'700',color:'#dbe5ff'},welcomeArtwork:{width:'100%',height:310,marginTop:-2},welcomeSheet:{backgroundColor:C.white,marginTop:-35,borderTopLeftRadius:34,borderTopRightRadius:34,paddingHorizontal:21,paddingTop:29,shadowColor:'#02091f',shadowOpacity:.2,shadowRadius:14,elevation:10},welcomeTitle:{fontSize:36,fontWeight:'900',letterSpacing:-1.45,lineHeight:40,color:'#13255b',textAlign:'center'},welcomeSubtitle:{fontSize:17,lineHeight:25,color:'#5f6987',textAlign:'center',paddingHorizontal:10,marginTop:10,marginBottom:27},welcomeChoice:{minHeight:112,borderRadius:23,borderWidth:1,borderColor:'#e6e9f2',backgroundColor:'#fff',flexDirection:'row',alignItems:'center',padding:16,marginBottom:13,shadowColor:'#1d2f67',shadowOpacity:.08,shadowRadius:10,shadowOffset:{width:0,height:4},elevation:3,gap:14},welcomeChoiceIcon:{width:55,height:55,borderRadius:18,backgroundColor:'#6756c9',alignItems:'center',justifyContent:'center'},welcomeChoiceIconAccent:{backgroundColor:'#3866cf'},welcomeChoiceTitle:{fontSize:19,fontWeight:'800',letterSpacing:-.45,color:'#14265e',marginBottom:5},welcomeChoiceBody:{fontSize:13,lineHeight:19,color:'#5d6786'},welcomeChoiceArrow:{width:38,height:38,borderRadius:19,backgroundColor:'#f2f5ff',alignItems:'center',justifyContent:'center'},welcomeHelp:{alignSelf:'center',minHeight:48,flexDirection:'row',alignItems:'center',gap:9,marginTop:9,paddingHorizontal:10},welcomeHelpText:{fontSize:15,fontWeight:'800',color:'#23469a',textDecorationLine:'underline'},welcomeFootnote:{fontSize:11,lineHeight:17,textAlign:'center',color:'#75809a',marginTop:4},
  loadingSafe:{flex:1,backgroundColor:'#11245f'},loadingHero:{height:330,paddingHorizontal:20,paddingTop:14,backgroundColor:'#11245f'},loadingTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},loadingSheet:{flex:1,marginTop:-35,borderTopLeftRadius:34,borderTopRightRadius:34,backgroundColor:C.white,paddingHorizontal:21,paddingTop:32},skeleton:{backgroundColor:'#e5eaf4',borderRadius:12},skeletonBrand:{width:144,height:40,backgroundColor:'#2c4181'},skeletonPill:{width:99,height:33,backgroundColor:'#2c4181',borderRadius:18},skeletonArtwork:{height:226,marginTop:27,backgroundColor:'#24417f',borderRadius:28},skeletonTitle:{width:'72%',height:36,alignSelf:'center',marginBottom:15},skeletonBody:{width:'91%',height:15,alignSelf:'center',marginBottom:9},skeletonBodyShort:{width:'65%',height:15,alignSelf:'center',marginBottom:29},skeletonChoice:{height:112,width:'100%',marginBottom:13,borderRadius:23},
  intro:{paddingTop:38,paddingBottom:27}, label:{fontSize:10,fontWeight:'800',letterSpacing:1,color:C.blue,marginBottom:10}, hero:{fontSize:38,fontWeight:'800',letterSpacing:-1.6,lineHeight:43,color:C.ink,marginBottom:15}, body:{fontSize:15,lineHeight:23,color:C.muted},
  feature:{minHeight:150,borderRadius:22,padding:25,marginBottom:13,justifyContent:'center'},featureDark:{backgroundColor:C.navy},featurePale:{backgroundColor:'#dceafb'},featureTitleLight:{color:'white',fontSize:24,fontWeight:'800',letterSpacing:-.6},featureTextLight:{color:'#c8daed',fontSize:14,marginTop:7},featureTitle:{color:C.ink,fontSize:24,fontWeight:'800',letterSpacing:-.6},featureText:{color:C.muted,fontSize:14,marginTop:7},arrowLight:{color:'white',fontSize:23,position:'absolute',right:25,bottom:22},arrow:{color:C.ink,fontSize:23,position:'absolute',right:25,bottom:22},
  helpStrip:{borderTopWidth:1,borderTopColor:C.line,marginTop:18,paddingTop:23},sectionTitle:{fontSize:18,fontWeight:'800',color:C.ink,marginBottom:9,letterSpacing:-.3},textAction:{minHeight:44,justifyContent:'center',alignSelf:'flex-start'},link:{color:C.blue,fontWeight:'700',fontSize:14},caption:{fontSize:12,lineHeight:18,color:C.muted,marginTop:12},
  screenHeader:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:24,paddingTop:12},back:{width:42,height:42,borderRadius:21,alignItems:'center',justifyContent:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.line},screenTitle:{fontSize:28,letterSpacing:-1,fontWeight:'800',color:C.ink},card:{padding:22,borderRadius:20,backgroundColor:C.white,marginBottom:15,borderWidth:1,borderColor:'#e5ebf1'},cardHeading:{fontSize:24,fontWeight:'800',lineHeight:29,letterSpacing:-.7,color:C.ink,marginBottom:12},emptyIcon:{width:56,height:56,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:C.pale,marginBottom:18},
  button:{minHeight:52,borderRadius:28,backgroundColor:C.navy,justifyContent:'center',alignItems:'center',paddingHorizontal:18,marginTop:16},buttonSecondary:{backgroundColor:C.white,borderWidth:1,borderColor:C.line},buttonText:{color:C.white,fontSize:14,fontWeight:'800'},buttonTextSecondary:{color:C.navy},disabled:{opacity:.4},pressed:{opacity:.75},
  fieldLabel:{fontSize:13,fontWeight:'700',color:C.ink,marginTop:22,marginBottom:9},textArea:{minHeight:155,borderColor:C.line,borderWidth:1,borderRadius:12,backgroundColor:'#fafbfd',padding:14,fontSize:15,color:C.ink},input:{height:52,borderWidth:1,borderColor:C.line,borderRadius:12,paddingHorizontal:14,color:C.ink,fontSize:16},sampleRow:{flexDirection:'row',gap:8,flexWrap:'wrap'},sample:{borderWidth:1,borderColor:C.line,borderRadius:24,paddingVertical:10,paddingHorizontal:13},sampleText:{color:C.blue,fontSize:12,fontWeight:'700'},
  neutralResult:{backgroundColor:'#e8f0f8'},warningResult:{backgroundColor:'#fff2df'},step:{flexDirection:'row',gap:14,marginTop:14},stepNumber:{color:C.blue,fontWeight:'800'},switchRow:{flexDirection:'row',gap:16,alignItems:'center',marginVertical:16},strong:{fontSize:14,fontWeight:'700',color:C.ink},quote:{padding:15,backgroundColor:C.page,borderRadius:10,marginVertical:18},quoteText:{fontSize:15,lineHeight:23,color:C.ink},notice:{color:C.blue,fontWeight:'700',fontSize:13,marginTop:15},metricRow:{flexDirection:'row',gap:12,marginTop:22},metric:{flex:1,backgroundColor:C.page,borderRadius:14,padding:16},metricValue:{fontSize:30,fontWeight:'800',color:C.ink},upload:{marginTop:18,padding:16,borderWidth:1,borderColor:C.line,borderRadius:12},screenshot:{width:'100%',height:180,marginTop:12,backgroundColor:C.page,borderRadius:12}
});
