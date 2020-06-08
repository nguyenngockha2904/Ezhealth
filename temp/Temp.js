 {/* Rain */}
 <View style={[styles.body, { paddingTop: 10 }]}>
 <View style={styles.bodyTitle}>
     <Text style={styles.titleBodyText}>Rain</Text>
 </View>

 <View style={styles.bodyContent}>
     <FlatList

         flexDirection={'column'}
         horizontal={true}
         style={styles.flatlistBoby}
         data={rain}
         contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         renderItem={({ item }) => (this.renderSoundsList(item))}
         keyExtractor={item => item.id.toString()}
     />
 </View>
</View>

{/* Nature */}
<View style={styles.body}>
 <View style={styles.bodyTitle}>
     <Text style={styles.titleBodyText}>Nature</Text>
 </View>

 <View style={styles.bodyContent}>
     <FlatList

         flexDirection={'column'}
         horizontal={true}
         style={styles.flatlistBoby}
         data={nature}
         contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         renderItem={({ item }) => (this.renderSoundsList(item))}
         keyExtractor={item => item.id.toString()}
     />
 </View>
</View>

{/* Animals */}
<View style={styles.body}>
 <View style={styles.bodyTitle}>
     <Text style={styles.titleBodyText}>Animals</Text>
 </View>

 <View style={styles.bodyContent}>
     <FlatList

         flexDirection={'column'}
         horizontal={true}
         style={styles.flatlistBoby}
         data={animals}
         contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         renderItem={({ item }) => (this.renderSoundsList(item))}
         keyExtractor={item => item.id.toString()}
     />
 </View>
</View>

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#35393f',
    },
    headerImage: {
        width: '100%',
        height: 310,
    },
    flatlistBoby: {

    },
    titleBodyText: {
        color: '#7DC481',
        flex: 1,
        alignSelf: 'center',
        fontFamily: 'quicksand-bold',
        fontSize: 30,
        paddingTop: 10
    },
    body: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',

    },
    bodyTitle: {
        paddingTop: 0,
        paddingLeft: 20,
        flexDirection: 'row',
    },
    bodyContent: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 0,
    },
});