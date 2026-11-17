# Przepływ działania — stan aktualny (demo w przeglądarce)

Wersja dokumentu: **2026-11-17**  
Kod: `_bolt-preview/project/` (Vite + React + TypeScript)  
Źródło prawdy: `src/demo/case.ts` + testy `src/App.test.tsx`

Ten opis opisuje **to, co jest zbudowane i przechodzi testy**, nie pełny plan produktu z `Plan-wdrozenia-wtyczka-Worda-v3-doprecyzowany.md`.

---

## 1. Co to jest

**Demo w przeglądarce** imitujące Worda z panelem wtyczki po prawej. Jedna gotowa sprawa: robocza **odpowiedź Firmy X** na wezwanie do zapłaty od ABC.

- Brak Office.js, logowania i backendu sprawy.
- Jest **lokalny serwer OCR** (`POST /api/ocr` → Gemini) pod Vite dev/preview.
- Jest **prezentacja 8 kroków** (tryb `tour`) oraz **tryb swobodny** (`free`) — domyślny po wejściu na stronę.

Wizja produktu (opis zadania własnymi słowami, biblioteka wzorów, audyt) pozostaje w planie v3; demo pokazuje **efekt na jednej sprawie** i na końcu krótką planszę „Tak to działa w kancelarii”.

---

## 2. Układ ekranu

Trzy strefy w jednym oknie przeglądarki:

| Strefa | Komponent | Rola |
|--------|-----------|------|
| Ramka Worda | `WordShell` | Pasek tytułu, wstążka (dekor), stopka. Tytuł dokumentu z modelu sprawy. W trybie `tour` reszta okna jest przyciemniona. |
| Kartka (środek) | `DocumentCanvas` | Albo **pismo** (odpowiedź), albo **podgląd pliku** po wyborze dokumentu. |
| Panel (~400 px) | `TaskPane` | Nagłówek, pasek dokumentów, zakładki, (opcjonalnie) pasek kroku, pole poleceń. |

Panel od góry:

1. **Nagłówek** — tytuł „Odpowiedź na wezwanie”, klient (skrócona nazwa), ikony Cofnij / Ponów / Ustawienia (dekor, bez logiki).
2. **Dokumenty** — zwijany pasek plików (`FileStrip`).
3. **Środek panelu** — zakładki *Obraz sprawy* | *Szkic* | *Kontrola* albo plansza końcowa.
4. **Prowadzenie** — tylko w `tour`: „Krok X z 8”, dymek, **Dalej**.
5. **Polecenia** (`PaneChat`) — pole tekstowe + Wyślij, zawsze na dole panelu (bez historii czatu).

---

## 3. Dane sprawy (jeden model)

Wszystko czyta `demoCase` z `case.ts`:

- **Zadanie:** odpowiedź na wezwanie do zapłaty.
- **Klient (odpowiadający):** Firma X sp. z o.o.
- **Strona wzywająca:** ABC sp. z o.o.
- **Kwoty:** faktura 12 000 zł, umowa 10 000 zł, różnica 2 000 zł.
- **Daty:** 05.11.2026 wpłata + pismo; 12.11.2026 wezwanie; 30.11.2026 termin odpowiedzi.
- **Braki:** brak potwierdzenia doręczenia wezwania; tytuł przelewu wskazuje umowę z 01.03.2026, nie fakturę 12/2026.
- **6 plików** w `demo-wzory/` (obrazy / PNG / JPG; PDF tam, gdzie jest w modelu).
- **Szkic pisma** — sekcje: DOTYCZY, Stanowisko, Uzasadnienie, Żądanie (akapity z opcjonalnym `sourceFileId`).
- **Kontrola** — 2 blokery, 2 ostrzeżenia (kolejność: blokery nad ostrzeżeniami).
- **8 kroków prezentacji** — definicja w `demoCase.steps`.

Teksty OCR do demo są w `demoOcrTexts.ts` i są powiązane z plikami w modelu (używane po skanowaniu / jako `preparedScan`).

---

## 4. Fazy aplikacji (`phase`)

| Faza | Jak wchodzi | Zachowanie |
|------|-------------|------------|
| `free` | Domyślnie (`main.tsx` → `<App />`) | Pełny panel, edycja pisma na kartce, brak przyciemnienia i kroku „Dalej”. |
| `tour` | `<App initialPhase="tour" />` (np. link demo z prezentacją) | 8 kroków, spotlight, ograniczenia kliknięć w pliki w kroku 6. |
| `end` | Po „Dalej” na kroku 8 w `tour` | Plansza „Tak to działa w kancelarii” zasłania zakładki; **Zamknij** → `free`. |

**Zmiana względem starszego planu demo:** nie ma już planszy startowej („3 minuty”, „Rozpocznij prezentację”). Prezentacja zaczyna od razu od **kroku 1** w trybie `tour`.

Stan w `App.tsx`:

- `phase`, `stepIndex`, `tab`, `openFile`, `files`, `letterSections`
- `ocrBusy`, `ocrStatus`, `ocrError`
- `markAmounts` — podświetlanie kwot na zielono (`MoneyText` / `markMoney`)

---

## 5. Pasek dokumentów (`FileStrip`)

- Nagłówek **„Dokumenty”** — klik rozwija / zwija listę (domyślnie zwinięta w `free`; w krokach tour z podświetleniem pliku lista może być otwarta).
- **6 miniaturek** — prawdziwe nazwy plików z modelu (np. `FV_12_2026_skan.jpg`), obraz z `demo-wzory/`.
- **Dodaj** — wybór pliku (JPG/PNG/WebP/PDF) → OCR przez API Gemini, nowy wpis na liście.
- **Skanowanie** — przycisk uruchamia `scanAll()`:
  - W trybie `free` przy starcie tekst z modelu trafia do `preparedScan`, a `ocrText` jest pusty → podgląd bez „Rozpoznanego dokumentu” do pierwszego skanu.
  - `scanAll` najpierw **odtwarza gotowe skany** z `preparedScan` (bez wołania API, jeśli wszystko jest przygotowane).
  - Dla brakujących tekstów: pobranie assetu i `POST /api/ocr`, albo OCR uploadu (blob).
  - Status: „Gotowe skany: N z M”, błędy per plik (`ocrFailed` na miniaturze).

---

## 6. Kartka — dwa widoki

### 6.1. Pismo (gdy `openFile === null`)

- Pełna odpowiedź Firmy X (Calibri, układ listu).
- W `free`: akapity **edytowalne** (`contentEditable`); treść idzie do `letterSections` i do eksportu DOCX.
- W `tour`: tylko podgląd (bez edycji).
- Sekcje mogą być podświetlone w kroku 5 (`letter` + `draft` w panelu).

### 6.2. Podgląd pliku (gdy wybrano dokument)

Nagłówek: **Wróć do pisma** + nazwa pliku.

Treść (`SourcePage`):

1. **Rozpoznany dokument** (jeśli jest `ocrText`) — `ScannedSheet`: tekst OCR ułożony na kartce A4 wg heurystyk `layoutScan.ts` (umowa, faktura, list, przelew, wzór, plain).
2. **Oryginał** — skan/JPG lub embed PDF **bez** nakładek cytatu na obrazie (stary model „niebieskiego prostokąta na skanie” został zastąpiony tekstem ustrukturyzowanym + czystym oryginałem).

Wybór pliku:

- Klik miniaturki na pasku.
- Klik daty / braku / kwoty (faktura, umowa) w *Obraz sprawy*.
- Klik skrótu źródła w *Szkic* (pierwsze słowa akapitu z `sourceFileId`).
- Polecenie w czacie (np. „otwórz fakturę”) — jeśli rozpoznane.

`Wróć do pisma` czyści `openFile`.

---

## 7. Zakładki panelu

### Obraz sprawy

- **Skrót sprawy:** „Do decyzji: różnica 2 000 zł · 2 braki”.
- Strony, przedmiot (zadanie, faktura, umowa).
- **Kwoty** — faktura i umowa klikalne → podgląd pliku; różnica nie.
- **Daty** — linki → pierwszy powiązany plik.
- **Do decyzji** — lista pytań (statyczna).
- **Braki** — klikalne → podgląd powiązanego pliku; w kroku 4 tour podświetlony brak doręczenia.

Polecenie „wyciągnij wszystkie kwoty” / „kwoty”: zakładka Obraz + zielone `mark` na kwotach w panelu i na piśmie (`amount-card.is-marked`, `amount-hit`).

### Szkic

- Nagłówki sekcji jak w piśmie; pod każdym skróty akapitów (max 5 słów).
- Akapity ze źródłem — przycisk → otwiera plik.

### Kontrola

- Blokery, potem ostrzeżenia.
- **Pobierz roboczy DOCX** — aktywny (`exportDocx`, biblioteka `docx`).
- **Eksport czysty** — widoczny, **wyłączony**, z adnotacją o blokach w kancelarii.

---

## 8. Pole poleceń (`PaneChat`)

Jedna linia wejścia, **bez logu odpowiedzi**. Po Enter / Wyślij, jeśli fraza pasuje do reguł, wykonuje akcję i czyści pole:

| Intencja (przykłady) | Akcja |
|----------------------|--------|
| skanuj, przeskanuj, … | `scanAll()` |
| braki | zakładka Obraz sprawy |
| kwoty, wyciągnij kwoty | `onMarkAmounts` + Obraz + scroll do kwot |
| obraz / szkic / kontrola | zmiana zakładki |
| pobierz, docx | pobranie DOCX |
| otwórz/pokaż/podgląd + faktura/umowa/… | `onOpenFile` po dopasowaniu `FILE_HINTS` |

Nierozpoznane polecenie — brak reakcji (tekst zostaje do poprawy).

---

## 9. Prezentacja — 8 kroków (`tour`)

Przyciemnienie (`tour-shade`), elementy z klasą `is-lit` i `data-tour`. Krok ustawia często `tab` i czasem wymusza powrót do pisma (`showLetter`).

| Krok | Dymek | Co się dzieje |
|------|-------|----------------|
| 1 | To jest Twoja sprawa. | Podświetlony nagłówek panelu (klient, bez pełnej narracji ABC w nagłówku). |
| 2 | System już rozpoznał strony… | Zakładka **Obraz sprawy**, cały blok faktów. |
| 3 | To jest różnica… | Podświetlone kwoty 12 000 / 10 000 oraz miniatury faktury i umowy. |
| 4 | To jest brak… | Podświetlony brak doręczenia. |
| 5 | To jest gotowy szkic… | **Szkic** + podświetlenie sekcji na piśmie. |
| 6 | To jest źródło — kliknij i sprawdź. | Miniatura faktury podświetlona; **Dalej zablokowane**, dopóki nie kliknięto faktury; kartka pokazuje podgląd z treścią 12 000 zł (po OCR/skanie w tour pliki mają `ocrText` od startu). |
| 7 | To jest kontrola… | **Kontrola**, blokery nad ostrzeżeniami. |
| 8 | To jest roboczy DOCX… | Podświetlone pobranie; kartka z powrotem na piśmie. |

Po kroku 8 → faza `end` → plansza kancelarii → **Zamknij** → `free` (pełna interakcja, edycja, miniatury, DOCX).

W `tour` klik w plik **poza** wymaganym w danym kroku (np. inny niż faktura w kroku 6) jest ignorowany (`openFromPane`).

---

## 10. OCR i serwer

- Klient: `src/lib/ocrClient.ts` — base64 pliku → `POST /api/ocr`.
- Serwer dev/preview: middleware Vite `src/server/ocrHttp.ts` + `geminiOcr` (wymaga klucza / konfiguracji w `.env` przez `loadEnv` w `vite.config.ts`).
- Skan plików demo z dysku: `ocrFromAsset.ts` — fetch assetu, potem ten sam endpoint.
- Składanie wizualne: `layoutScan(text)` → typ dokumentu → komponenty w `ScannedSheet.tsx`.
- Skrypt pomocniczy: `npm run ocr:demo` (`scripts/generate-demo-ocr.mjs`) — generowanie tekstów demo (poza runtime UI).

W testach Vitest **nie ma** prawdziwego API: skanowanie opiera się na `preparedScan` z tekstów demo.

---

## 11. Eksport DOCX

`downloadDocx` — nagłówek stron, strony, sekcje z aktualnej treści `letterSections` (po edycji w `free`). Nazwa pliku: `{documentName}.docx`.

---

## 12. Przepływ użytkownika — skróty

### A. Wejście standardowe (`free`)

1. Otwarcie strony → od razu widać Word, pismo Firmy X, panel z zakładką Obraz.
2. Rozwinięcie **Dokumenty** → miniatury, opcjonalnie **Skanowanie** → ustrukturyzowany tekst + oryginał przy podglądzie.
3. Praca w zakładkach, podglądy, pole poleceń, edycja pisma, **Pobierz roboczy DOCX**.

### B. Wejście z prezentacją (`tour`)

1. Od **kroku 1** — tylko **Dalej** (+ w kroku 6 klik w fakturę).
2. Po kroku 8 — plansza produktowa → Zamknij → jak w A.

### C. Produkt docelowy (niezaimplementowane w tym repo)

Opis zadania na start, plan pracy, własne pliki i wzory od zera, Office.js, role, audyt — zgodnie z planem v3 i sekcją „Poza tym linkiem” w starym planie demo.

---

## 13. Technicznie — uruchomienie

Katalog projektu: `_bolt-preview/project/`

```bash
npm install
npm run dev      # dev + /api/ocr + serwowanie demo-wzory/
npm test         # Vitest + RTL — kontrakt zachowania
npm run build    # dist + kopia demo-wzory/
npm run preview  # build + OCR middleware
```

Assety sprawy: `demo-wzory/` (w repo obok `_bolt-preview`; Vite mapuje `/demo-wzory/…`).

Główne pliki:

| Plik | Odpowiedzialność |
|------|------------------|
| `App.tsx` | Stan globalny, fazy, skan, kroki, eksport |
| `demo/case.ts` | Model sprawy i kroki tour |
| `demo/TaskPane.tsx` | Panel, zakładki, tour bar |
| `demo/DocumentCanvas.tsx` | Pismo vs podgląd |
| `demo/FileStrip.tsx` | Lista plików, dodaj, skan |
| `demo/PaneChat.tsx` | Interpretacja poleceń |
| `demo/layoutScan.ts` | Układ OCR na A4 |
| `demo/exportDocx.ts` | DOCX |

---

## 14. Różnice względem `Plan-demo-przegladarka.md` (v1.2)

| Było w planie | Jest teraz |
|---------------|------------|
| Plansza startowa + „Rozpocznij prezentację” | Brak; tour od kroku 1 |
| Domyślnie tour / gotowe OCR od razu na ekranie | Domyślnie `free`; OCR tekst po **Skanowanie** (cache w `preparedScan`) |
| Stały pasek 6 miniatur (2×3), bez „Dodaj” | Zwijany „Dokumenty”; **Dodaj plik** + **Skanowanie** |
| Cytat jako `#cfe4fa` na obrazie skanu | Tekst „Rozpoznany dokument” + czysty oryginał |
| Tylko przycisk Dalej w demo | Dodatkowo **Polecenia** na dole panelu |
| „Do decyzji…” w nagłówku panelu | Skrót w zakładce **Obraz sprawy** |
| Krótkie nazwy miniatur (Umowa, Faktura…) | Pełne nazwy plików z modelu |

---

## 15. Mapowanie na wizję produktu (v3)

Demo pokazuje fragment docelowego łańcucha:

1. Dokumenty sprawy → (tu: gotowe 6 plików + OCR).
2. **Obraz sprawy** → strony, kwoty, daty, braki, pytania.
3. **Szkic** → robocze pismo powiązane ze źródłami.
4. **Kontrola** → blokery / ostrzeżenia przed „czystym” eksportem.
5. Redakcja w edytorze (symulowanym Wordzie) + roboczy DOCX.

Czego demo **nie** robi: interpretacji opisu zadania od prawnika, dynamicznego planu pracy, biblioteki wzorów kancelarii, wersjonowania opisu, audytu.

---

*Koniec dokumentu — do kopiowania i wysyłki.*