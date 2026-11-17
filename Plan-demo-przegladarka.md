# Plan wdrożenia — demo w przeglądarce

Wersja 1.1. Zakres: link do maila, jedna sprawa, wygląd Worda z wtyczką. Bez backendu, logowania i Office.js.

Źródła treści: `DEMO-WOW-dla-prawnika.md` (przebieg) i `Plan-wdrozenia-wtyczka-Worda-v3-doprecyzowany.md` (sprawa ABC, fakty, kontrola). Ten dokument mówi tylko, jak złożyć demo.

## Decyzje

1. Demo to gotowa sprawa ABC, nie mała wersja produktu. Prawnik niczego nie wgrywa i niczego nie konfiguruje.
2. Pliki sprawy siedzą na górze panelu, jako miniatury kartek. Kliknięcie otwiera podgląd na białej kartce Worda i podświetla cytat. Osobna zakładka „Dokumenty” odpada — pasek jest zawsze widoczny.
3. Prowadzenie ma osiem kroków i jeden przycisk „Dalej”. Krok sam otwiera zakładkę i podświetla fragment w panelu oraz na kartce.
4. Wygląd panelu jest jak okienko dodatku w Wordzie: Segoe UI, biały panel, drobne kontrolki, niebieskie zaznaczenie Worda. Schemat z planu (ramki, Georgia, przyciski w nawiasach) nie wchodzi do interfejsu.
5. Kafelek „Dodaj plik” nie wchodzi do demo. Martwy plus wygląda jak niedokończona funkcja. W produkcie dodawanie plików zostaje; w mailu pliki już są w sprawie.
6. Na końcu jedna krótka plansza mówi, jak to działa w kancelarii: opis zadania własnymi słowami, własne dokumenty, własny wzór, redakcja w Wordzie.

## Sprawa w demo

Jedna sprawa, te same dane w panelu, na kartce i w DOCX.

- Zadanie: odpowiedź na wezwanie do zapłaty.
- Klient: ABC sp. z o.o. Druga strona: Firma X sp. z o.o.
- Faktura nr 12/2026: 12 000 zł. Umowa z 01.03.2026: 10 000 zł. Różnica: 2 000 zł.
- 05.11.2026 — twierdzenie o zapłacie. 12.11.2026 — wezwanie. 30.11.2026 — termin odpowiedzi.
- Braki: brak potwierdzenia doręczenia wezwania; brak dokumentu, który łączy wpłatę z fakturą nr 12/2026.

Sześć plików na pasku, w tej kolejności:

| Miniatura | Co widać po kliknięciu | Cytat do podświetlenia |
|---|---|---|
| Umowa | Strona umowy, 01.03.2026 | wynagrodzenie 10 000 zł |
| Faktura | Faktura nr 12/2026 | kwota 12 000 zł |
| Wezwanie | Wezwanie z 12.11.2026 | żądanie zapłaty i termin |
| Pismo klienta | Pismo z 05.11.2026 | „dokonano zapłaty” jako twierdzenie strony |
| Przelew | Potwierdzenie przelewu bez wskazania faktury | kwota wpłaty, brak numeru faktury |
| Wzór | Wzór odpowiedzi, z którego powstał szkic | sekcje: stanowisko, uzasadnienie, żądanie |

Status przy pasku: „6 plików · gotowe”. OCR jest już zrobiony. Żadnego klepsydrowego „trwa rozpoznawanie” — sprawa na starcie jest skończona.

## Ekran

Okno wypełnia przeglądarkę. Trzy strefy.

**Ramka Worda.** Pasek tytułu, wstążka, stopka. Zostają rozpoznawalne i nieklikalne poza tym, co demo naprawdę robi. Nazwa dokumentu: „Odpowiedź na wezwanie — ABC”. Inicjały profilu zostają. Napis „Uaktualnij plan” i pusty Copilot schodzą. Wstążka nie dostaje funkcji.

**Kartka.** Dwa widoki, ten sam obszar:

- Pismo — prawdziwy układ odpowiedzi (Calibri, marginesy, nagłówek, DOTYCZY, stanowisko, uzasadnienie, żądanie, załączniki). Bez pól w nawiasach i bez czcionki maszynowej.
- Źródło — po kliknięciu miniatury kartka pokazuje jedną stronę tego pliku. Cytat ma niebieskie zaznaczenie jak w Wordzie. Nad kartką pasek: nazwa pliku, „Wróć do pisma”.

Po zakończeniu prezentacji pismo można edytować na kartce. Pobrany DOCX bierze treść z tego widoku.

**Panel wtyczki, ok. 400 px.** Od góry:

1. Nagłówek: „Odpowiedź na wezwanie”, sprawa ABC sp. z o.o., „Zapisano”. Pod spodem jedna linia: „Do decyzji: różnica 2 000 zł · 2 braki”.
2. Pasek plików: podpis „Pliki sprawy” i sześć miniatur (mała kartka, dwie–trzy kreski treści, nazwa pod spodem). Wybrana miniatura ma obwódkę w kolorze zaznaczenia Worda.
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
| 1 | To jest Twoja sprawa. | Nagłówek: ABC, strony, termin 30.11 |
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
- Miniatura: 52×68 px, biała kartka, cień jak strona, nazwa 11 px pod spodem. W dwóch rzędach po trzy, żeby pasek był niski.
- Pismo: Calibri, 11 pt, interlinia jak w Wordzie, szerokość strony ok. 720 px, cień kartki.
- Źródło: ta sama kartka, inna treść, cytat z tłem `#cfe4fa`.
- Podświetlenie prezentacji: reszta okna przyciemniona, aktywny element z obwódką `#0f6cbd` i krótkim dymkiem. Bez strzałek „kliknij tutaj” przy rzeczach, które krok i tak sam otwiera.
- Stany miniatur: zwykła, najechana, wybrana. Wybrana zostaje, dopóki prawnik nie wróci do pisma.

## Technicznie

Projekt z `project-bolt-sb1-a8pgxued.zip` rozpakować do katalogu roboczego (Vite, React, TypeScript). `npm install` w katalogu głównym nie ma czego czytać — `package.json` jest w archiwum.

Jeden model sprawy w `src/demo/case.ts`: strony, kwoty, daty, braki, sześć plików z cytatem, sekcje szkicu, blokery, ostrzeżenia, osiem kroków. Panel, kartka i DOCX czytają ten sam model.

Komponenty:

- `WordShell` — ramka.
- `DocumentCanvas` — pismo albo źródło.
- `TaskPane` — nagłówek, pasek plików, zakładki, treść.
- `FileStrip` — miniatury.
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
   Test `case.test.ts`: sześć plików, kwoty 12 000 / 10 000 / różnica 2 000, daty 05.11, 12.11 i 30.11, dwa braki, cytat przy każdym pliku. Test widoku: tytuł „Odpowiedź na wezwanie — ABC”, na kartce stanowisko, uzasadnienie i żądanie, brak nawiasów typu `[LOGO KANCELARII]`.

3. Złożyć panel: nagłówek, pasek sześciu miniatur, trzy zakładki z treścią.
   Test: nagłówek ma „ABC sp. z o.o.” i „Do decyzji: różnica 2 000 zł · 2 braki”. Pasek ma dokładnie sześć miniatur, bez „Dodaj”. Zakładki Obraz sprawy, Szkic i Kontrola przełączają treść. Obraz pokazuje obie kwoty i oba braki. Szkic pokazuje sekcje pisma. Kontrola pokazuje blokery nad ostrzeżeniami. Nie ma zakładki Dokumenty.

4. Podpiąć klik miniatury i klik faktu: kartka źródła, cytat, powrót do pisma.
   Test, po jednym na plik: klik Umowy pokazuje 10 000 zł, klik Faktury pokazuje 12 000 zł, klik Wezwania pokazuje termin, klik Pisma klienta pokazuje „dokonano zapłaty”, klik Przelewu nie pokazuje numeru faktury, klik Wzoru pokazuje sekcje wzoru. Cytat ma zaznaczenie. „Wróć do pisma” wraca do odpowiedzi. Klik kwoty 12 000 zł w Obrazie sprawy otwiera fakturę. Klik „źródło” przy różnicy w Szkicu otwiera fakturę albo umowę.

5. Plansza startowa i osiem kroków z podświetleniem. Krok 6 czeka na klik w fakturę.
   Test planszy: widać „3 minuty”, różnicę 2 000 zł, 2 braki i przycisk „Rozpocznij prezentację”. Po starcie widać „Krok 1 z 8”.
   Osobny test na każdy krok prezentacji. Przed asercją klika „Dalej” aż do tego kroku.

   | Krok | Test sprawdza |
   |---|---|
   | 1 | Dymek „To jest Twoja sprawa.” Podświetlony nagłówek z ABC i termin 30.11. |
   | 2 | Dymek o rozpoznaniu. Otwarty Obraz sprawy: strony, kwoty, daty, braki. |
   | 3 | Dymek o różnicy. Podświetlone 12 000 zł i 10 000 zł oraz miniatury faktury i umowy. |
   | 4 | Dymek o braku. Podświetlony brak potwierdzenia doręczenia. |
   | 5 | Dymek o szkicu. Otwarta zakładka Szkic i podświetlone te same sekcje na piśmie. |
   | 6 | Dymek o źródle. „Dalej” nie przechodzi dalej, dopóki nie ma kliknięcia w fakturę. Po kliknięciu kartka pokazuje cytat 12 000 zł. |
   | 7 | Dymek o kontroli. Otwarta Kontrola, blokery nad ostrzeżeniami. |
   | 8 | Dymek o DOCX. Widać pobranie, kartka z powrotem pokazuje pismo. |

6. Pobranie DOCX i plansza końcowa. Po niej wolne klikanie.
   Test: pobrany plik jest `.docx` i zawiera ABC sp. z o.o., 12 000 zł, 10 000 zł oraz żądanie wyjaśnienia różnicy. Po kroku 8 widać planszę o pracy w kancelarii (opis zadania, własne dokumenty, własny wzór, redakcja w Wordzie). Po zamknięciu planszy działają miniatury, trzy zakładki i edycja pisma. Zmiana zdania na kartce wchodzi do następnego pobrania.

7. Przejście wizualne: odstępy, czcionka, zaznaczenie, miniatury, szerokość panelu na laptopie 1280 px.
   Lista w przeglądarce, odhaczana przed krokiem 8: panel ok. 400 px, Segoe UI w chromie i panelu, Calibri na piśmie, miniatury w dwóch rzędach po trzy, zaznaczenie cytatu `#cfe4fa`, akcent `#0f6cbd`, brak Georgii i ramek ze schematu. Potem ponownie `npm test` — testy z kroków 2–6 nadal zielone.

8. Build i przejście ścieżki od linku do pobranego pliku.
   Test: `npm test` i `npm run build` przechodzą. Na zbudowanej stronie, od świeżego otwarcia: plansza startowa, osiem kroków, klik faktury w kroku 6, pobranie DOCX, plansza końcowa, powrót do klikalnego panelu.

## Poza tym linkiem

Opis zadania na starcie, plan pracy, dodawanie plików, dodawanie wzoru, OCR na żywo, role, retencja, audyt, Office.js, Azure. To jest plan produktu, nie ten mail.
