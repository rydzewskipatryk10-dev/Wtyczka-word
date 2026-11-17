# Plan wdrożenia — demo w przeglądarce

Wersja 1.2. Zakres: link do maila, jedna sprawa, wygląd Worda z wtyczką. Bez backendu, logowania i Office.js.

1.2 dopisuje wzory stron z `demo-wzory/`: miniatura na pasku „Pliki” jest zmniejszoną, rozpoznawalną stroną, a kliknięcie otwiera podgląd tej samej strony.

Źródła treści: `DEMO-WOW-dla-prawnika.md` (przebieg) i `Plan-wdrozenia-wtyczka-Worda-v3-doprecyzowany.md` (fakty, kontrola). Strony na kartkach biorą się z wzorów w `demo-wzory/`. Ten dokument mówi tylko, jak złożyć demo.

## Decyzje

1. Demo to gotowa sprawa: odpowiedź Firmy X na wezwanie ABC. To nie jest mała wersja produktu. Prawnik niczego nie wgrywa i niczego nie konfiguruje.
2. Pliki sprawy siedzą na górze panelu. Miniatura jest zmniejszoną kopią prawdziwej strony z `demo-wzory/`, na tyle dużą, że z paska widać rodzaj dokumentu. Kliknięcie otwiera podgląd tej samej strony na kartce Worda i podświetla cytat. Pasek zostaje odsłonięty także na planszy startowej. Osobna zakładka „Dokumenty” odpada.
3. Prowadzenie ma osiem kroków i jeden przycisk „Dalej”. Krok sam otwiera zakładkę i podświetla fragment w panelu oraz na kartce.
4. Wygląd panelu jest jak okienko dodatku w Wordzie: Segoe UI, biały panel, drobne kontrolki, niebieskie zaznaczenie Worda. Schemat z planu (ramki, Georgia, przyciski w nawiasach) nie wchodzi do interfejsu.
5. Kafelek „Dodaj plik” nie wchodzi do demo. Martwy plus wygląda jak niedokończona funkcja. W produkcie dodawanie plików zostaje; w mailu pliki już są w sprawie.
6. Na końcu jedna krótka plansza mówi, jak to działa w kancelarii: opis zadania własnymi słowami, własne dokumenty, własny wzór, redakcja w Wordzie.

## Sprawa w demo

Jedna sprawa, te same dane w panelu, na kartce i w DOCX.

- Zadanie: odpowiedź na wezwanie do zapłaty.
- Klient, czyli strona odpowiadająca: Firma X sp. z o.o. Strona wzywająca i wystawca faktury: ABC sp. z o.o.
- Faktura nr 12/2026: 12 000 zł. Umowa z 01.03.2026: 10 000 zł. Różnica: 2 000 zł.
- 05.11.2026 — wpłata i pismo Firmy X o zamknięciu rozliczenia. 12.11.2026 — wezwanie ABC. 30.11.2026 — termin odpowiedzi.
- Braki: brak potwierdzenia doręczenia wezwania; tytuł przelewu wskazuje umowę z 01.03.2026, a nie fakturę nr 12/2026.

Wzory rozstrzygają, kto jest kim. Wezwanie i faktura wychodzą od ABC, wpłata i pismo o zamknięciu sprawy od Firmy X. Panel, nazwa pisma i podgląd mówią to samo.

Sześć plików na pasku, w tej kolejności. Miniatura i podgląd biorą ten sam plik z `demo-wzory/`.

| Miniatura | Plik | Co widać na miniaturze i w podglądzie | Cytat do podświetlenia |
|---|---|---|---|
| Umowa | `umowa.jpg` | zdjęcie wydrukowanej umowy, tytuł „UMOWA O ŚWIADCZENIE USŁUG”, data 01.03.2026, Firma X jako zamawiający, ABC jako wykonawca | „wynagrodzenie 10 000 zł” w § 2 |
| Faktura | `faktura.jpg` | skan, „FAKTURA nr 12/2026”, tabela, sprzedawca ABC, nabywca Firma X | „12 000 zł” |
| Wezwanie | `wezwanie.pdf` | czyste pismo, „WEZWANIE DO ZAPŁATY”, data 12.11.2026, ABC wzywa Firmę X | „kwoty 12 000 zł” i „Termin odpowiedzi 30.11.2026” |
| Pismo klienta | `pismo-klienta.jpg` | zdjęcie kartki na ciemnym tle, data 05.11.2026, nadawca Firma X, adresat ABC | „dokonano zapłaty” i zdanie o zamknięciu sprawy rozliczenia |
| Przelew | `przelew.jpg` | zrzut bankowości elektronicznej: zielony pasek, znacznik, „Przelew zrealizowany” | „kwota wpłaty 10 000 zł” i tytuł „płatność za usługi wg umowy z 01.03.2026” |
| Wzór | `wzor-odpowiedzi.pdf` | szablon odpowiedzi, pola w nawiasach kwadratowych | nagłówki: Stanowisko, Uzasadnienie, Żądanie |

Na przelewie tytuł wskazuje umowę z 01.03.2026. Numeru faktury 12/2026 na potwierdzeniu nie ma. Pismo klienta mówi o zapłacie należności z umowy, nie z faktury.

Status przy pasku: „6 plików · gotowe”. OCR jest już zrobiony. Żadnego klepsydrowego „trwa rozpoznawanie” — sprawa na starcie jest skończona.

Miniatura ma ramkę kartki jednego rozmiaru, ok. 96×128 px, a w środku całą stronę (obraz wpasowany, z białym marginesem, gdy proporcje są inne). Dwa rzędy po trzy. Pod spodem nazwa, 11 px. Z samej miniatury da się odróżnić sześć dokumentów: zielony pasek przelewu, nagłówek faktury, tytuł umowy, tytuł wezwania, zdjęcie pisma, tytuł wzoru. Wybrana miniatura ma obwódkę w kolorze zaznaczenia Worda.

Kliknięcie miniatury otwiera podgląd na kartce Worda, w miejscu pisma. To ta sama strona, w skali czytelnej. Zdjęcie zostaje zdjęciem (kartka, cień, tło), skan zostaje skanem, przelew zostaje zrzutem. Wezwanie i wzór są czystą stroną pisma. Nad kartką pasek: nazwa pliku, „Wróć do pisma”. Cytat leży na właściwym fragmencie strony jako zaznaczenie `#cfe4fa`.

Wezwanie i wzór przed złożeniem paska zapisujemy jako PNG obok pozostałych wzorów (`wezwanie.png`, `wzor-odpowiedzi.png`). Miniatura i podgląd ładują obraz strony. Pozycja cytatu na obrazie siedzi w modelu sprawy.

## Ekran

Okno wypełnia przeglądarkę. Trzy strefy.

**Ramka Worda.** Pasek tytułu, wstążka, stopka. Zostają rozpoznawalne i nieklikalne poza tym, co demo naprawdę robi. Nazwa dokumentu: „Odpowiedź na wezwanie — Firma X”. Inicjały profilu zostają. Napis „Uaktualnij plan” i pusty Copilot schodzą. Wstążka nie dostaje funkcji.

**Kartka.** Dwa widoki, ten sam obszar:

- Pismo — prawdziwy układ odpowiedzi (Calibri, marginesy, nagłówek, DOTYCZY, stanowisko, uzasadnienie, żądanie, załączniki). Bez pól w nawiasach i bez czcionki maszynowej.
- Źródło — po kliknięciu miniatury kartka pokazuje tę samą stronę, którą widać na miniaturze, w skali do czytania. Cytat ma niebieskie zaznaczenie jak w Wordzie, położone na fragmencie strony. Nad kartką pasek: nazwa pliku, „Wróć do pisma”.

Po zakończeniu prezentacji pismo można edytować na kartce. Pobrany DOCX bierze treść z tego widoku.

**Panel wtyczki, ok. 400 px.** Od góry:

1. Nagłówek: „Odpowiedź na wezwanie”, sprawa Firma X sp. z o.o., „Zapisano”. Pod spodem jedna linia: „Do decyzji: różnica 2 000 zł · 2 braki”.
2. Pasek plików: podpis „Pliki sprawy” i sześć miniatur prawdziwych stron, z nazwą pod spodem. Pasek widać od pierwszego ekranu. Klik działa: w kroku 6 prezentacji na fakturze, a po zakończeniu prezentacji na każdym pliku. Wybrana miniatura ma obwódkę w kolorze zaznaczenia Worda.
3. Zakładki: **Obraz sprawy**, **Szkic**, **Kontrola**.
4. Treść zakładki.
5. Na czas prezentacji pasek kroku przyklejony na dole panelu: „Krok 3 z 8”, zdanie dymku, przycisk „Dalej”.

Zakładki:

- **Obraz sprawy** — strony, przedmiot, kwoty obok siebie (12 000 / 10 000 / różnica), daty, trzy pytania do decyzji, dwa braki. Kwota, data i brak są klikalne i otwierają właściwy plik.
- **Szkic** — sekcje pisma. Przy zdaniu o różnicy i przy żądaniu jest link „źródło”, który otwiera fakturę albo umowę. Sekcja w panelu i ten sam akapit na kartce podświetlają się razem.
- **Kontrola** — najpierw blokery (sprzeczność kwot bez wyjaśnienia w czystym eksporcie, twierdzenie o zapłacie bez powiązania z fakturą), potem ostrzeżenia (brak potwierdzenia doręczenia, termin 30.11). Przycisk „Pobierz roboczy DOCX” jest aktywny. „Eksport czysty” jest widoczny i niedostępny, z jednym zdaniem: w kancelarii schodzi po rozwiązaniu blokerów.

## Przebieg prezentacji

Start, zanim widać zakładki: środek panelu zasłania plansza.

„Zobacz, jak w 3 minuty przygotujesz odpowiedź na wezwanie do zapłaty.”

Cztery punkty: rozpoznane strony i termin, różnica 2 000 zł, 2 braki, roboczy szkic. Przycisk: „Rozpocznij prezentację”.

Potem tylko „Dalej”. Krok przełącza zakładkę, miniaturę i kartkę. Podświetlenie przyciemnia resztę i zostawia jasny obszar wokół jednej rzeczy.

| Krok | Zdanie | Co się otwiera i co świeci |
|---|---|---|
| 1 | To jest Twoja sprawa. | Nagłówek: Firma X, strony, termin 30.11 |
| 2 | System już rozpoznał strony, przedmiot i termin. | Obraz sprawy, rozwinięte strony, kwoty, daty, braki |
| 3 | To jest różnica, której nie można pominąć. | 12 000 zł i 10 000 zł; miniatury faktury i umowy |
| 4 | To jest brak, który może zatrzymać sprawę. | Brak potwierdzenia doręczenia |
| 5 | To jest gotowy szkic odpowiedzi. | Zakładka Szkic i te same sekcje na piśmie |
| 6 | To jest źródło — kliknij i sprawdź. | „Dalej” czeka na klik w fakturę; kartka pokazuje cytat 12 000 zł |
| 7 | To jest kontrola przed eksportem. | Zakładka Kontrola, blokery nad ostrzeżeniami |
| 8 | To jest roboczy DOCX — gotowy do redakcji. | Przycisk pobrania; kartka wraca do pisma |

Po 8. kroku plansza zamykająca, cztery zdania: opisujesz zadanie własnymi słowami, dokładasz dokumenty i wzór, dostajesz obraz, szkic i kontrolę, redagujesz w Wordzie. Potem panel zostaje w pełni klikalny: miniatury, zakładki, pobranie, edycja pisma.

Krok 6 jest jedynym miejscem, w którym prawnik klika coś poza „Dalej”. Dymek stoi przy miniaturze faktury, dopóki jej nie wybierze.

## Wygląd

- Chrome i panel: Segoe UI, tło aplikacji `#f3f2f1`, panel biały, linia `#edebe9`, tekst `#242424`, akcent `#0f6cbd`.
- Miniatura: ok. 96×128 px, ramka kartki, w środku zmniejszona strona wzoru, nazwa 11 px pod spodem. Dwa rzędy po trzy. Przy szerokości panelu ok. 400 px cała szóstka zostaje na ekranie, a charakter strony (kolor, tytuł, zdjęcie) pozostaje czytelny.
- Pismo: Calibri, 11 pt, interlinia jak w Wordzie, szerokość strony ok. 720 px, cień kartki.
- Źródło: ta sama kartka, strona z `demo-wzory/`, cytat z tłem `#cfe4fa` na właściwym fragmencie.
- Podświetlenie prezentacji: reszta okna przyciemniona, aktywny element z obwódką `#0f6cbd` i krótkim dymkiem. Bez strzałek „kliknij tutaj” przy rzeczach, które krok i tak sam otwiera.
- Stany miniatur: zwykła, najechana, wybrana. Wybrana zostaje, dopóki prawnik nie wróci do pisma.

## Technicznie

Projekt z `project-bolt-sb1-a8pgxued.zip` rozpakować do katalogu roboczego (Vite, React, TypeScript). `npm install` w katalogu głównym nie ma czego czytać — `package.json` jest w archiwum.

Jeden model sprawy w `src/demo/case.ts`: strony, kwoty, daty, braki, sześć plików z ścieżką do obrazu strony, pozycją cytatu i tekstem cytatu, sekcje szkicu, blokery, ostrzeżenia, osiem kroków. Panel, kartka i DOCX czytają ten sam model. Obrazy stron leżą w `demo-wzory/`.

Komponenty:

- `WordShell` — ramka.
- `DocumentCanvas` — pismo albo źródło.
- `TaskPane` — nagłówek, pasek plików, zakładki, treść.
- `FileStrip` — sześć miniatur, każda z obrazem strony i nazwą. Klik ustawia podgląd.
- `Tour` — krok, przyciemnienie, dymek, „Dalej”.
- `StartScreen` i plansza końcowa.
- `exportDocx` — plik `.docx` z biblioteki `docx`, ta sama treść co pismo na kartce.

Stan:

- `phase`: start, tour, free
- `step`: 0–7
- `tab`: obraz, szkic, kontrola
- `openFile`: id pliku albo pusto
- `letterText`: treść pisma do edycji i do eksportu

Krok prezentacji ustawia `tab` i cel podświetlenia. Klik miniatury ustawia `openFile` i przełącza kartkę na źródło. „Wróć do pisma” czyści `openFile`.

Bez serwera. Hosting: `npm run build`, statyczny katalog `dist`, link w mailu.

## Testy

Po każdym kroku roboczym odpalane są testy tego kroku i wszystkie testy z kroków wcześniejszych. Następny krok startuje dopiero, gdy ten zestaw jest zielony. Dzięki temu późniejsza zmiana od razu pokazuje, który kawałek demo się rozjechał.

Narzędzie: Vitest i React Testing Library, wpięte w Vite. Jedno polecenie: `npm test`. Testy leżą obok kodu (`case.test.ts`, `App.test.tsx`). Wygląd z kroku 7 sprawdza krótka lista kontrolna w przeglądarce, bo odstępy i czcionka słabo wychodzą w teście jednostkowym.

Osiem kroków prezentacji ma osobny test każdy. Powstają w kroku roboczym 5 i zostają w zestawie do końca.

## Kolejność robót

Każdy punkt kończy się testem. Test ma przejść, zanim zacznie się kolejny punkt.

1. Rozpakować projekt, uruchomić Vite, wyrzucić treść Copilota i schemat z panelu.
   Test: `npm test` wstaje i przechodzi pusty zestaw. `npm run dev` otwiera okno. Na stronie nie ma „Uaktualnij plan”, „Co chcesz utworzyć?” ani przycisków w nawiasach `[Pokaż źródła]`.

2. Wstawić model sprawy i ramkę Worda z prawdziwym pismem.
   Test `case.test.ts`: sześć plików, każdy z obrazem strony z `demo-wzory/`, kwoty 12 000 / 10 000 / różnica 2 000, daty 05.11, 12.11 i 30.11, dwa braki, cytat przy każdym pliku. Klient to Firma X, strona wzywająca to ABC. Test widoku: tytuł „Odpowiedź na wezwanie — Firma X”, na kartce stanowisko, uzasadnienie i żądanie, brak nawiasów typu `[LOGO KANCELARII]`.

3. Złożyć panel: nagłówek, pasek sześciu miniatur, trzy zakładki z treścią.
   Test: nagłówek ma „Firma X sp. z o.o.” i „Do decyzji: różnica 2 000 zł · 2 braki”. Pasek ma dokładnie sześć miniatur, bez „Dodaj”. Każda miniatura pokazuje obraz swojej strony i nazwę pod spodem. Pasek jest widoczny także, gdy plansza startowa zasłania środek panelu. Zakładki Obraz sprawy, Szkic i Kontrola przełączają treść. Obraz pokazuje obie kwoty i oba braki. Szkic pokazuje sekcje pisma. Kontrola pokazuje blokery nad ostrzeżeniami. Nie ma zakładki Dokumenty.

4. Podpiąć klik miniatury i klik faktu: kartka źródła, cytat, powrót do pisma.
   Test, po jednym na plik: klik miniatury otwiera podgląd tej samej strony, którą widać na miniaturze. Klik Umowy pokazuje 10 000 zł, klik Faktury pokazuje 12 000 zł, klik Wezwania pokazuje termin 30.11.2026, klik Pisma klienta pokazuje „dokonano zapłaty”, klik Przelewu pokazuje 10 000 zł i tytuł o umowie z 01.03.2026, bez numeru faktury, klik Wzoru pokazuje sekcje wzoru. Cytat ma zaznaczenie na tym fragmencie strony. „Wróć do pisma” wraca do odpowiedzi. Klik kwoty 12 000 zł w Obrazie sprawy otwiera fakturę. Klik „źródło” przy różnicy w Szkicu otwiera fakturę albo umowę.

5. Plansza startowa i osiem kroków z podświetleniem. Krok 6 czeka na klik w fakturę.
   Test planszy: widać „3 minuty”, różnicę 2 000 zł, 2 braki i przycisk „Rozpocznij prezentację”. Po starcie widać „Krok 1 z 8”.
   Osobny test na każdy krok prezentacji. Przed asercją klika „Dalej” aż do tego kroku.

   | Krok | Test sprawdza |
   |---|---|
   | 1 | Dymek „To jest Twoja sprawa.” Podświetlony nagłówek z Firma X i termin 30.11. |
   | 2 | Dymek o rozpoznaniu. Otwarty Obraz sprawy: strony, kwoty, daty, braki. |
   | 3 | Dymek o różnicy. Podświetlone 12 000 zł i 10 000 zł oraz miniatury faktury i umowy. |
   | 4 | Dymek o braku. Podświetlony brak potwierdzenia doręczenia. |
   | 5 | Dymek o szkicu. Otwarta zakładka Szkic i podświetlone te same sekcje na piśmie. |
   | 6 | Dymek o źródle. „Dalej” nie przechodzi dalej, dopóki nie ma kliknięcia w fakturę. Po kliknięciu kartka pokazuje cytat 12 000 zł. |
   | 7 | Dymek o kontroli. Otwarta Kontrola, blokery nad ostrzeżeniami. |
   | 8 | Dymek o DOCX. Widać pobranie, kartka z powrotem pokazuje pismo. |

6. Pobranie DOCX i plansza końcowa. Po niej wolne klikanie.
   Test: pobrany plik jest `.docx` i zawiera Firma X sp. z o.o., ABC sp. z o.o., 12 000 zł, 10 000 zł oraz żądanie wyjaśnienia różnicy. Po kroku 8 widać planszę o pracy w kancelarii (opis zadania, własne dokumenty, własny wzór, redakcja w Wordzie). Po zamknięciu planszy działają miniatury, trzy zakładki i edycja pisma. Zmiana zdania na kartce wchodzi do następnego pobrania.

7. Przejście wizualne: odstępy, czcionka, zaznaczenie, miniatury, szerokość panelu na laptopie 1280 px.
   Lista w przeglądarce, odhaczana przed krokiem 8: panel ok. 400 px, Segoe UI w chromie i panelu, Calibri na piśmie, miniatury w dwóch rzędach po trzy i na tyle duże, że z paska widać zielony pasek przelewu, nagłówek faktury, tytuł umowy, tytuł wezwania, zdjęcie pisma i tytuł wzoru. Klik każdej miniatury otwiera czytelny podgląd tej strony, a cytat ma tło `#cfe4fa`. Akcent `#0f6cbd`. Brak Georgii i ramek ze schematu. Potem ponownie `npm test` — testy z kroków 2–6 nadal zielone.

8. Build i przejście ścieżki od linku do pobranego pliku.
   Test: `npm test` i `npm run build` przechodzą. Na zbudowanej stronie, od świeżego otwarcia: plansza startowa, osiem kroków, klik faktury w kroku 6, pobranie DOCX, plansza końcowa, powrót do klikalnego panelu.

## Poza tym linkiem

Opis zadania na starcie, plan pracy, dodawanie plików, dodawanie wzoru, OCR na żywo, role, retencja, audyt, Office.js, Azure. To jest plan produktu, nie ten mail.
