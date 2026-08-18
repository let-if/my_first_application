// import { StyleSheet } from 'react-native';

// import { ExternalLink } from './ExternalLink';
// import { MonoText } from './StyledText';
// import { Text, View } from './Themed';

// import Colors from '@/constants/Colors';

// export default function EditScreenInfo({ path }: { path: string }) {
//   return (
//     <View>
//       <View style={styles.getStartedContainer}>
//         <Text
//           style={styles.getStartedText}
//           lightColor="rgba(0,0,0,0.8)"
//           darkColor="rgba(255,255,255,0.8)">
//           Open up the code for this screen:
//         </Text>

//         <View
//           style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
//           darkColor="rgba(255,255,255,0.05)"
//           lightColor="rgba(0,0,0,0.05)">
//           <MonoText>{path}</MonoText>
//         </View>

//         <Text
//           style={styles.getStartedText}
//           lightColor="rgba(0,0,0,0.8)"
//           darkColor="rgba(255,255,255,0.8)">
//           Change any of the text, save the file, and your app will automatically update.
//         </Text>
//       </View>

//       <View style={styles.helpContainer}>
//         <ExternalLink
//           style={styles.helpLink}
//           href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
//           <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
//             Tap here if your app doesn't automatically update after making changes
//           </Text>
//         </ExternalLink>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightContainer: {
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   helpContainer: {
//     marginTop: 15,
//     marginHorizontal: 20,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     textAlign: 'center',
//   },
// });
import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(15, 23, 42, 0.85)"
          darkColor="rgba(255, 255, 255, 0.85)">
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(16, 185, 129, 0.12)"
          lightColor="rgba(4, 120, 87, 0.08)">
          <MonoText style={styles.monoText}>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(100, 116, 139, 0.9)"
          darkColor="rgba(148, 163, 184, 0.9)">
          Change any of the text, save the file, and your Addis Ababa marketplace app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text style={styles.helpLinkText} lightColor="#047857" darkColor="#34D399">
            Tap here if your app doesn't automatically update after making changes ↗
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  homeScreenFilename: {
    marginVertical: 10,
  },
  codeHighlightContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(4, 120, 87, 0.2)',
  },
  monoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  getStartedText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  helpContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 8,
  },
  helpLinkText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
  },
});