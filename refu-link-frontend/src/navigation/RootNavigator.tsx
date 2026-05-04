import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import IdentificationScreen from "../screens/IdentificationScreen";
import BiometricScreen from "../screens/BiometricScreen";
import ChangePinScreen from "../screens/ChangePinScreen";
import LoginScreen from "../screens/LoginScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import DepositOptionsScreen from "../screens/DepositScreen";
import MainTabNavigator from "./MainTabNavigator";
import EditProfileScreen from "../screens/EditProfileScreen";
import SecuritySettingsScreen from "../screens/SecuritySettingScreen";
import LanguageSettingsScreen from "../screens/LanguageSettingScreen";
import HelpSupportScreen from "../screens/HelpScreen";
import SendMoneyScreen from "../screens/SendMoneyScreen";
import SendConfirmScreen from "../screens/SendConfirmScreen";
import SendSuccessScreen from "../screens/SendSuccessScreen";
import AgentDepositScreen from "../screens/AgentDepositScreen";
import AidDepositScreen from "../screens/AidDepositScreen";
import MpesaDepositScreen from "../screens/MpesaDepositScreen";
import VaultScreen from "../screens/VaultScreen";
import RequestLoanScreen from "../screens/RequestLoanScreen";
import LoanSuccessScreen from "../screens/LoanSuccessScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import VaultDepositScreen from "../screens/VaulDepositScreen";
import VaultDepositSuccessScreen from "../screens/VaultDepositSuccessScreen";
import VaultWithdrawScreen from "../screens/VaultWithdrawScreen";
import VaultWithdrawSuccessScreen from "../screens/VaultWithdrawSuccessScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        
        animation: 'fade_from_bottom',
        animationDuration: 400,         
      }}
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
      />
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
      />
      <Stack.Screen name="Identification" component={IdentificationScreen} />
      <Stack.Screen name="Biometric" component={BiometricScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="DepositOptions" component={DepositOptionsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Security" component={SecuritySettingsScreen} />
      <Stack.Screen name="Language" component={LanguageSettingsScreen} />
      <Stack.Screen name="Help" component={HelpSupportScreen} />
      <Stack.Screen name="Send" component={SendMoneyScreen} 
        options={{
            animation: 'slide_from_bottom'     // You can override per screen
          }}
      />
      <Stack.Screen name="SendConfirm" component={SendConfirmScreen} />
      <Stack.Screen name="SendSuccess" component={SendSuccessScreen} />
      <Stack.Screen name="AgentDeposit" component={AgentDepositScreen} />
      <Stack.Screen name="AidDeposit" component={AidDepositScreen} />
      <Stack.Screen name="MpesaDeposit" component={MpesaDepositScreen} />
      <Stack.Screen name="Vault" component={VaultScreen} />
      <Stack.Screen name="RequestLoan" component={RequestLoanScreen} />
      <Stack.Screen name="LoanSuccess" component={LoanSuccessScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="VaultDeposit" component={VaultDepositScreen} />
      <Stack.Screen name="VaultDepositSuccess" component={VaultDepositSuccessScreen} />
      <Stack.Screen name="VaultWithdraw" component={VaultWithdrawScreen} />
      <Stack.Screen name="VaultWithdrawSuccess" component={VaultWithdrawSuccessScreen} />
    </Stack.Navigator>
  );
}