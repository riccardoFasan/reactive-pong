export function isIonicReady(): Promise<HTMLIonAppElement> {
  return document.querySelector('ion-app')!.componentOnReady();
}
