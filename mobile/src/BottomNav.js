import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const items = [
  ['home', 'Home', 'home-outline', 'home'],
  ['check', 'Check', 'search-outline', 'check'],
  ['family', 'Family', 'people-outline', 'family'],
  ['settings', 'Settings', 'settings-outline', 'settings']
];

export default function BottomNav({ current, navigate, bottomInset }) {
  return <View style={[s.wrap, { paddingBottom: Math.max(bottomInset, 10) }]}>{items.map(([key, label, icon, target]) => {
    const active = current === key || (key === 'family' && current === 'guardian');
    return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} key={key} onPress={() => navigate(target)} style={s.item}><View style={[s.iconWrap, active && s.iconActive]}><Ionicons name={active && key === 'home' ? 'home' : icon} size={22} color={active ? '#3159c7' : '#69758a'}/></View><Text style={[s.label, active && s.labelActive]}>{label}</Text></Pressable>;
  })}</View>;
}

const s = StyleSheet.create({wrap:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#e1e6ef',paddingTop:7,paddingHorizontal:12},item:{flex:1,minHeight:55,alignItems:'center',justifyContent:'center'},iconWrap:{width:42,height:30,borderRadius:16,alignItems:'center',justifyContent:'center'},iconActive:{backgroundColor:'#e8edff'},label:{fontSize:10,fontWeight:'600',color:'#69758a',marginTop:2},labelActive:{color:'#3159c7',fontWeight:'800'}});
