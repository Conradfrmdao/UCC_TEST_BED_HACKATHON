import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const C = { ink:'#101c33', muted:'#657189', blue:'#3159c7', navy:'#12245d', white:'#fff', line:'#e1e6ef', green:'#119c85', page:'#f4f6fb' };

function ActionTile({ title, detail, icon, tone, onPress }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.actionTile, tone === 'warm' && s.actionWarm, pressed && s.pressed]}>
    <View style={[s.actionIcon, tone === 'warm' && s.actionIconWarm]}><Ionicons name={icon} size={25} color={C.blue}/></View>
    <Text style={s.actionTitle}>{title}</Text><Text style={s.actionDetail}>{detail}</Text>
    <View style={s.actionArrow}><Ionicons name="arrow-forward" size={17} color={C.blue}/></View>
  </Pressable>;
}

function UtilityTile({ title, detail, icon, onPress }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.utilityTile, pressed && s.pressed]}>
    <Ionicons name={icon} size={25} color={C.blue}/><View style={s.grow}><Text style={s.utilityTitle}>{title}</Text><Text style={s.utilityDetail}>{detail}</Text></View><Ionicons name="chevron-forward" size={18} color="#76839a"/>
  </Pressable>;
}

export default function ChildHome({ family, navigate, openFamily, openHelpline }) {
  const name = family.role === 'child' && family.childName ? family.childName : 'friend';
  return <>
    <LinearGradient colors={['#111e58', '#263f96', '#176d9c']} start={{x:0,y:0}} end={{x:1,y:1}} style={s.hero}>
      <View style={s.brandRow}><View style={s.brandMark}><Ionicons name="shield-checkmark-outline" size={27} color={C.white}/></View><Text style={s.brand}>Chinga</Text><Pressable accessibilityRole="button" accessibilityLabel="Open family connection" onPress={() => openFamily('start')} style={s.familyButton}><Ionicons name="people-outline" size={22} color={C.white}/></Pressable></View>
      <Text style={s.hello}>Hi, {name}</Text>
      <View style={s.connectionPill}><View style={[s.statusDot, family.linked && s.statusDotOn]}/><Text style={s.connectionText}>{family.linked ? `Connected to ${family.guardianName || 'your family'}` : 'Family connection is optional'}</Text></View>
      <View style={s.heroShape}/>
    </LinearGradient>

    <View style={s.sheet}>
      <Text style={s.heading}>How can we help today?</Text><Text style={s.subheading}>Pause, check, and ask for help when something online feels wrong.</Text>
      <View style={s.actionRow}><ActionTile title="Is this safe?" detail="Check a message or link." icon="help-circle-outline" onPress={() => navigate('check')}/><ActionTile title="Something happened" detail="Tell us in your own words." icon="alert-circle-outline" tone="warm" onPress={() => navigate('report')}/></View>
      <View style={s.utilityGrid}><UtilityTile title="My protection" detail="Review family preferences" icon="shield-outline" onPress={() => navigate('settings')}/><UtilityTile title="Safety history" detail="See previous demo checks" icon="time-outline" onPress={() => navigate('history')}/><UtilityTile title="Help & support" detail="Guidance and Sauti 116" icon="chatbubble-ellipses-outline" onPress={() => navigate('help')}/><UtilityTile title="Family connection" detail={family.linked ? 'Connected' : 'Link a trusted guardian'} icon="people-outline" onPress={() => openFamily('start')}/></View>
      <View style={s.protectionCard}><View style={s.protectionIcon}><Ionicons name="shield-checkmark-outline" size={26} color={C.green}/></View><View style={s.grow}><Text style={s.protectionTitle}>Protection setup</Text><Text style={s.protectionText}>Choose what your family wants to prepare for.</Text></View><Pressable accessibilityRole="button" onPress={() => navigate('settings')} style={s.reviewButton}><Text style={s.reviewText}>Review</Text></Pressable></View>
      <Pressable accessibilityRole="button" onPress={openHelpline} style={s.helpline}><Text style={s.helplineTitle}>Need to talk to someone?</Text><Text style={s.helplineText}>Open the phone dialler for Uganda Sauti 116.</Text><Ionicons name="call-outline" size={21} color={C.blue}/></Pressable>
    </View>
  </>;
}

const s = StyleSheet.create({
  grow:{flex:1},pressed:{opacity:.76},hero:{marginHorizontal:-20,marginTop:-12,paddingHorizontal:22,paddingTop:19,paddingBottom:44,minHeight:245,overflow:'hidden'},brandRow:{flexDirection:'row',alignItems:'center'},brandMark:{width:43,height:43,borderRadius:15,backgroundColor:'#ffffff18',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#ffffff24'},brand:{fontSize:27,fontWeight:'900',letterSpacing:-.8,color:C.white,marginLeft:11,flex:1},familyButton:{width:45,height:45,borderRadius:23,backgroundColor:'#ffffff18',alignItems:'center',justifyContent:'center'},hello:{fontSize:34,fontWeight:'900',letterSpacing:-1.2,color:C.white,marginTop:30},connectionPill:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#ffffff18',borderWidth:1,borderColor:'#ffffff24',borderRadius:20,paddingHorizontal:13,paddingVertical:8,marginTop:11},statusDot:{width:8,height:8,borderRadius:4,backgroundColor:'#d3dcf1'},statusDotOn:{backgroundColor:'#43d5bd'},connectionText:{color:'#edf3ff',fontSize:12,fontWeight:'600'},heroShape:{position:'absolute',width:230,height:230,borderRadius:115,backgroundColor:'#2bc2d433',right:-105,bottom:-130},
  sheet:{marginHorizontal:-20,marginTop:-28,paddingHorizontal:20,paddingTop:28,paddingBottom:10,borderTopLeftRadius:34,borderTopRightRadius:34,backgroundColor:C.page},heading:{fontSize:29,lineHeight:34,fontWeight:'900',letterSpacing:-1.1,color:C.ink},subheading:{fontSize:14,lineHeight:21,color:C.muted,marginTop:6,marginBottom:20},actionRow:{flexDirection:'row',gap:12},actionTile:{flex:1,minHeight:195,padding:18,borderRadius:24,backgroundColor:'#e9efff',borderWidth:1,borderColor:'#dce5fb'},actionWarm:{backgroundColor:'#f4f0f3',borderColor:'#ebe3e8'},actionIcon:{width:49,height:49,borderRadius:16,backgroundColor:'#d3dfff',alignItems:'center',justifyContent:'center',marginBottom:18},actionIconWarm:{backgroundColor:'#e4dcf4'},actionTitle:{fontSize:20,lineHeight:23,fontWeight:'900',letterSpacing:-.5,color:C.ink,maxWidth:145},actionDetail:{fontSize:12,lineHeight:18,color:C.muted,marginTop:8,maxWidth:135},actionArrow:{position:'absolute',right:15,bottom:15,width:36,height:36,borderRadius:18,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
  utilityGrid:{gap:10,marginTop:13},utilityTile:{minHeight:86,flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:18,paddingVertical:14,borderRadius:20,backgroundColor:C.white,borderWidth:1,borderColor:C.line},utilityTitle:{fontSize:15,fontWeight:'800',color:C.ink},utilityDetail:{fontSize:12,lineHeight:17,color:C.muted,marginTop:3},protectionCard:{flexDirection:'row',alignItems:'center',gap:13,padding:16,borderRadius:22,backgroundColor:'#ebf8f6',borderWidth:1,borderColor:'#ccebe5',marginTop:13},protectionIcon:{width:47,height:47,borderRadius:15,backgroundColor:'#d4f1ec',alignItems:'center',justifyContent:'center'},protectionTitle:{fontSize:15,fontWeight:'800',color:C.ink},protectionText:{fontSize:11,lineHeight:16,color:C.muted,marginTop:3},reviewButton:{minHeight:36,borderRadius:18,backgroundColor:C.navy,paddingHorizontal:13,alignItems:'center',justifyContent:'center'},reviewText:{fontSize:11,fontWeight:'800',color:C.white},helpline:{minHeight:90,marginTop:13,borderTopWidth:1,borderTopColor:C.line,paddingVertical:19,paddingRight:40},helplineTitle:{fontSize:16,fontWeight:'800',color:C.ink},helplineText:{fontSize:12,lineHeight:18,color:C.muted,marginTop:4},
});
