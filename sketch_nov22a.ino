#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN   21
#define RST_PIN  22

MFRC522 rfid(SS_PIN, RST_PIN);

// ------ WIFI & API тохиргоо ------
const char* WIFI_SSID     = "STARLINK";
const char* WIFI_PASSWORD = "Teee123456";

// baganaa.online дээрх backend API
// HTTP ажиллаж байвал http://, SSL бол https:// ашиглана
const char* API_URL = "https://baganaa.online/api/scan";   // хүсвэл http://baganaa.online/api/scan

// ================== Туслах функцууд ==================

void connectWiFi() {
  Serial.print("WiFi-д холбогдож байна");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nWiFi connected! IP: ");
  Serial.println(WiFi.localIP());
}

String uidToHex(const MFRC522::Uid &uid) {
  String s = "";
  for (byte i = 0; i < uid.size; i++) {
    if (uid.uidByte[i] < 0x10) s += "0";
    s += String(uid.uidByte[i], HEX);
    if (i < uid.size - 1) s += ":";   // 04:A1:BC:...
  }
  s.toUpperCase();
  return s;
}

void sendScanToServer(const String &uidHex) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi салсан байна, дахин холбогдож байна...");
    connectWiFi();
  }

  HTTPClient http;

  Serial.print("API руу илгээж байна: ");
  Serial.println(API_URL);

  http.begin(API_URL);

  http.addHeader("Content-Type", "application/json");

  // ⚠️ Хэрвээ backend талдаа field нь өөр байвал ("card_id" гэх мэт)
  // зөвхөн энэ мөрийг өөрчилнө:
  String body = String("{\"uid\":\"") + uidHex + "\"}";

  Serial.print("JSON body: ");
  Serial.println(body);

  int httpCode = http.POST(body);

  if (httpCode > 0) {
    Serial.print("HTTP код: ");
    Serial.println(httpCode);
    String response = http.getString();
    Serial.print("Server response: ");
    Serial.println(response);
  } else {
    Serial.print("HTTP алдаа: ");
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
}

// ================== setup / loop ==================

void setup() {
  Serial.begin(9600);
  delay(200);

  SPI.begin();          // ESP32 default: SCK=18, MOSI=23, MISO=19
  rfid.PCD_Init();

  Serial.println("\n--- NFC Reader + HTTP Gateway ---");
  connectWiFi();

  Serial.println("RC522 бэлэн. Tag-аа уншигч дээр тавина уу...");
}

void loop() {
  // Шинэ tag ирээгүй бол
  if (!rfid.PICC_IsNewCardPresent()) {
    delay(100);
    return;
  }
  if (!rfid.PICC_ReadCardSerial()) {
    delay(100);
    return;
  }

  // UID хэвлэх
  String uidHex = uidToHex(rfid.uid);
  Serial.print("Tag UID: ");
  Serial.println(uidHex);

  MFRC522::PICC_Type type = rfid.PICC_GetType(rfid.uid.sak);
  Serial.print("Tag type: ");
  Serial.println(rfid.PICC_GetTypeName(type));

  // 👉 ЭНД baganaa.online руу хүсэлт шидэж байна
  sendScanToServer(uidHex);

  // Tag-ийг уншиж дуусаад crypto-оо зогсооно
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  // Давхар уншилт багасгахын тулд жижиг delay
  delay(800);
}
