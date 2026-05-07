import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/onboarding/SplashScreen";
import IdentificationScreen from "../screens/IdentificationScreen";
import BiometricScreen from "../screens/security/BiometricScreen";
import ChangePinScreen from "../screens/security/ChangePinScreen";
import LoginScreen from "../screens/LoginScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import DepositOptionsScreen from "../screens/dashboard/DepositScreen";
import MainTabNavigator from "./MainTabNavigator";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import SecuritySettingsScreen from "../screens/profile/SecuritySettingScreen";
import LanguageSettingsScreen from "../screens/profile/LanguageSettingScreen";
import HelpSupportScreen from "../screens/profile/HelpScreen";
import SendMoneyScreen from "../screens/dashboard/SendMoneyScreen";
import SendConfirmScreen from "../screens/dashboard/SendConfirmScreen";
import SendSuccessScreen from "../screens/dashboard/SendSuccessScreen";
import AgentDepositScreen from "../screens/dashboard/AgentDepositScreen";
import AidDepositScreen from "../screens/dashboard/AidDepositScreen";
import MpesaDepositScreen from "../screens/dashboard/MpesaDepositScreen";
import VaultScreen from "../screens/vault/VaultScreen";
import RequestLoanScreen from "../screens/vault/RequestLoanScreen";
import LoanSuccessScreen from "../screens/vault/LoanSuccessScreen";
import TransactionDetailScreen from "../screens/history/TransactionDetailScreen";
import VaultDepositScreen from "../screens/vault/VaulDepositScreen";
import VaultDepositSuccessScreen from "../screens/vault/VaultDepositSuccessScreen";
import VaultWithdrawScreen from "../screens/vault/VaultWithdrawScreen";
import VaultWithdrawSuccessScreen from "../screens/vault/VaultWithdrawSuccessScreen";

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