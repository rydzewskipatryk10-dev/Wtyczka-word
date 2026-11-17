PLAN WDROŻENIA — WTYCZKA WORDA DLA KANCELARII
Wersja 3.0 — doprecyzowana koncepcja
Status: propozycja produktowa do walidacji przed budową MVP.

ZASADA NADRZĘDNA
Prawnik nie wybiera z góry „typu sprawy” ani nie wypełnia formularza. Prawnik opisuje zadanie własnymi słowami, a system na tej podstawie ustala zakres pracy, potrzebne dane i strukturę dokumentu.

Przykład:
„Przygotuj roboczą odpowiedź na wezwanie do zapłaty z 12 listopada. Reprezentuję ABC sp. z o.o. Kwestionuję różnicę 2 000 zł między umową a fakturą. Nie dopisuj danych, których nie potwierdzono. Użyj wzoru odpowiedzi na wezwanie.”

System nie pyta: „wybierz typ sprawy”.
System analizuje opis i dokumenty, a następnie proponuje plan pracy.

1. ODPOWIEDŹ NA PYTANIE O OPIS PROJEKTU
Tak. Opis zadania przez prawnika przed rozpoczęciem pracy powinien być podstawą działania systemu.

To jest lepsze niż sztywny wybór typu sprawy, ponieważ:
- prawnik zawsze pracuje na konkretnej sprawie, nie na abstrakcyjnej kategorii;
- opis zawiera kontekst, ograniczenia i oczekiwany rezultat;
- system nie musi zgadywać, czego prawnik oczekuje;
- łatwiej kontrolować, czy AI działa w granicach polecenia;
- można wersjonować opis i pokazywać, kiedy zmienił się kontekst pracy.

Opis nie musi być długi. Wystarczą 3–5 zdań.

Przykład dobrego opisu:
„Przygotuj roboczą odpowiedź na wezwanie do zapłaty z 12 listopada. Reprezentuję ABC sp. z o.o. Kwestionuję różnicę 2 000 zł między umową a fakturą. Sprawdź termin odpowiedzi. Nie dopisuj danych, których nie potwierdzono. Użyj wzoru odpowiedzi na wezwanie.”

2. CO SYSTEM WYCIĄGA Z OPISU
System powinien rozpoznawać z opisu:

- rodzaj dokumentu do przygotowania;
- stronę reprezentowaną;
- przedmiot sprawy;
- kluczowe kwestie;
- ograniczenia;
- wymagany wzór;
- oczekiwany rezultat;
- poziom stanowczości, jeśli prawnik go określi.

System nie powinien:
- wymuszać wyboru kategorii;
- zgadywać strategii procesowej;
- dodawać twierdzeń, których nie ma w dokumentach;
- samodzielnie decydować o stanowisku prawnika.

3. JAK DZIAŁA SYSTEM PO WPISANIU OPISU
Po wpisaniu opisu system:

1. Analizuje opis.
2. Proponuje plan pracy.
3. Wskazuje, jakich dokumentów potrzebuje.
4. Proponuje strukturę dokumentu.
5. Ekstrahuje dane tylko w zakresie potrzebnym do zadania.
6. Pokazuje fakty krytyczne i braki.
7. Tworzy szkic roboczy.
8. Pozwala prawnikowi redagować w Wordzie.
9. Kontroluje spójność przed eksportem.

Przykład planu pracy:

┌────────────────────────────────────────────────────────────┐
│ PLAN PRACY                                                 │
│ Zadanie: odpowiedź na wezwanie do zapłaty                  │
│ Klient: ABC sp. z o.o.                                     │
│ Stanowisko: kwestionowanie różnicy 2 000 zł                │
├────────────────────────────────────────────────────────────┤
│ 1. Analiza dokumentów                                      │
│ 2. Identyfikacja stron i roszczenia                        │
│ 3. Chronologia i terminy                                   │
│ 4. Porównanie umowy i faktury                              │
│ 5. Identyfikacja braków                                    │
│ 6. Przygotowanie szkicu odpowiedzi                         │
│ 7. Kontrola przed eksportem                                │
├────────────────────────────────────────────────────────────┤
│ [Rozpocznij] [Zmień opis] [Dodaj dokumenty]                │
└────────────────────────────────────────────────────────────┘

4. BIBLIOTEKA WZORÓW — DECYZJA
Tak. Biblioteka wzorów powinna być dostępna pod przyciskiem „Dodaj wzór”, ale jako prosty, przejrzysty moduł.

Nie tworzymy osobnej aplikacji do zarządzania wzorami.
Nie wymuszamy strukturyzowania każdego DOCX-a od razu.

Model działania:

- Prawnik klika „Dodaj wzór”.
- Wybiera plik DOCX lub przeciąga go do panelu.
- System zapisuje wzór w bibliotece kancelarii.
- System próbuje rozpoznać pola i strukturę.
- Jeśli rozpozna pola — proponuje mapowanie.
- Jeśli nie rozpozna — wzór nadal można użyć jako bazę tekstu, ale bez automatycznego wypełniania.
- Prawnik może oznaczyć wzór jako „przygotowany do automatyzacji” dopiero po weryfikacji.

To jest praktyczne rozwiązanie:
- proste na start;
- nie zmusza do budowania biblioteki przed użyciem produktu;
- pozwala stopniowo strukturyzować wzory;
- nie obiecuje automatyzacji każdego DOCX-a.

5. JAK WYGLĄDA DODAWANIE WZORU
Schemat — Dodaj wzór

┌────────────────────────────────────────────────────────────┐
│ DODAJ WZÓR                                                 │
├────────────────────────────────────────────────────────────┤
│ Przeciągnij plik DOCX lub kliknij, aby wybrać              │
│                                                            │
│ [Wybierz plik]                                             │
│                                                            │
│ Po dodaniu system spróbuje rozpoznać pola i strukturę.     │
│ Jeśli rozpozna pola — zaproponuje mapowanie.               │
│ Jeśli nie rozpozna — wzór będzie dostępny jako baza tekstu.│
├────────────────────────────────────────────────────────────┤
│ [Zapisz wzór] [Anuluj]                                     │
└────────────────────────────────────────────────────────────┘

6. CZY KAŻDY WYCIĄGNIĘTY ELEMENT PRZEKIEROWUJE DO ŹRÓDŁA
Tak. Każdy istotny element po kliknięciu powinien prowadzić do konkretnego miejsca w źródle.

Dotyczy to:
- faktów;
- dat;
- kwot;
- twierdzeń;
- roszczeń;
- terminów;
- wyników analizy;
- sprzeczności;
- fragmentów szkicu;
- pól wzoru.

Zasada:
„Każde twierdzenie w systemie musi mieć ścieżkę do źródła.”

Przykład:
- Fakt: „Kwota 12 000 zł”
- Kliknięcie → otwiera fakturę na stronie 1
- System podświetla dokładny fragment: „Kwota: 12 000 zł”
- Prawnik widzi źródło i może zatwierdzić, odrzucić lub edytować.

To jest kluczowa funkcja produktu.

7. JAK DZIAŁA PRZEKIEROWANIE
Mechanizm:

1. System wykonuje OCR i parsowanie.
2. Zapisuje lokalizację fragmentu: strona, współrzędne, tekst.
3. Każdy fakt ma identyfikator źródła.
4. Kliknięcie faktu otwiera podgląd źródła.
5. System przewija do właściwego miejsca.
6. System podświetla fragment.
7. Prawnik może podjąć decyzję.

To działa dla:
- PDF;
- DOCX;
- JPG;
- PNG;
- skanów;
- tabel;
- korespondencji.

8. PRZYKŁAD PRZEKIEROWANIA
Fakt: „Rzekoma zapłata 05.11.2026”

Kliknięcie → otwiera pismo klienta, strona 1, fragment:
„Dnia 5 listopada 2026 r. dokonano zapłaty…”

System pokazuje:
- źródło;
- stronę;
- fragment;
- status: twierdzenie strony;
- brak potwierdzenia dokumentem;
- opcje: zatwierdź, odrzuć, poproś o dokument.

To jest właściwy model.

9. CO ZMIENIAMY W INTERFEJSIE
Nowy interfejs opiera się na trzech filarach:

A. Opis zadania na starcie
Prawnik wpisuje, co chce zrobić.

B. Obraz sprawy
System pokazuje całość: strony, przedmiot, terminy, braki, ryzyka.

C. Ścieżka do źródła
Każdy istotny element prowadzi do konkretnego miejsca w dokumencie.

10. NOWY PANEL GŁÓWNY
Schemat — Panel główny

┌────────────────────────────────────────────────────────────┐
│ SPRAWA: ABC sp. z o.o. — należność 12 000 zł     ↶ ↷  ⚙    │
│ Zadanie: Odpowiedź na wezwanie do zapłaty                  │
│ Status: 3 blokery · 5 ostrzeżeń · projekt roboczy gotowy   │
├────────────────────────────────────────────────────────────┤
│ [ Obraz sprawy ] [ Dokumenty ] [ Szkic ] [ Kontrola ]      │
├────────────────────────────────────────────────────────────┤
│ OBRAZ SPRAWY                                               │
│                                                            │
│ Strony                                                     │
│ • Powód / wierzyciel: Firma X sp. z o.o.                   │
│ • Pozwany / dłużnik: ABC sp. z o.o.                        │
│                                                            │
│ Przedmiot                                                  │
│ • Należność z faktury nr 12/2026                           │
│ • Kwota według faktury: 12 000 zł                          │
│ • Kwota według umowy: 10 000 zł                            │
│                                                            │
│ Kluczowe daty i terminy                                    │
│ • 05.11.2026 — rzekoma zapłata                             │
│ • 12.11.2026 — wezwanie do zapłaty                         │
│ • 30.11.2026 — termin odpowiedzi                           │
│                                                            │
│ Co wymaga decyzji                                          │
│ • Czy różnica 2 000 zł dotyczy tej samej należności?       │
│ • Czy zapłata 05.11 dotyczy faktury nr 12/2026?            │
│ • Czy zachowano termin odpowiedzi?                         │
│                                                            │
│ Braki                                                      │
│ • Brak potwierdzenia doręczenia wezwania                   │
│ • Brak dokumentu potwierdzającego zapłatę                  │
│                                                            │
│ [Pokaż źródła] [Przygotuj szkic] [Zadaj pytanie]           │
├────────────────────────────────────────────────────────────┤
│ [Dodaj kontekst do zadania]                                │
│ [ Zapytaj ] [ Wykonaj ]                                    │
└────────────────────────────────────────────────────────────┘

11. FAKTY — POZIOMY PEWNOŚCI
Fakty nie wymagają zatwierdzania każdego osobno.

Poziomy:

A. Krytyczne
Wpływają bezpośrednio na pismo.
Wymagają decyzji.

B. Robocze
Mogą być użyte w szkicu.
Nie wymagają osobnej akceptacji.

C. Niepewne
Nie mogą trafić do pisma bez decyzji.

D. Odrzucone
Nie są używane, ale pozostają w historii.

12. ANALIZA — CO ROBI
Analiza odpowiada na konkretne pytania:

- chronologia;
- porównanie kwot;
- porównanie dat;
- wykrywanie braków;
- pytania do klienta;
- oznaczanie sprzeczności.

Analiza nie robi w MVP:
- opinii prawnej;
- strategii procesowej;
- oceny szans;
- wyszukiwania orzecznictwa.

13. SZKIC — TRZY POZIOMY
A. Struktura
- nagłówek;
- strony;
- przedmiot;
- stanowisko;
- uzasadnienie;
- żądania;
- załączniki.

B. Szkic roboczy
- tekst roboczy;
- pola do uzupełnienia;
- źródła;
- propozycje argumentów.

C. Projekt do redakcji
- dokument w Wordzie;
- śledzenie zmian;
- kontrola spójności.

14. KONTROLA — CHECKLISTA WYJŚCIA
Poziomy:

A. Blokery
Nie można eksportować czystego DOCX-a bez rozwiązania:
- brak strony;
- brak daty;
- brak podstawy roszczenia;
- sprzeczność kwot bez wyjaśnienia;
- twierdzenie bez źródła;
- nieaktualny fragment.

B. Ostrzeżenia
Można eksportować, ale system ostrzega:
- brak potwierdzenia doręczenia;
- niepewny OCR;
- brak załącznika;
- termin bliski upływowi.

C. Informacje
- liczba źródeł;
- liczba pominiętych dokumentów;
- data analizy;
- wersja wzoru.

15. BEZPIECZEŃSTWO
Minimalny standard:
- dane w UE;
- szyfrowanie w tranzycie i w spoczynku;
- brak trenowania modeli na danych klienta;
- logi bez treści dokumentów;
- dostęp oparty na rolach;
- możliwość usunięcia sprawy;
- retencja zgodna z polityką kancelarii.

16. ARCHITEKTURA
- Office.js
- TypeScript / React
- Azure Static Web Apps
- Azure Functions
- Entra ID
- Azure OpenAI
- Azure Document Intelligence
- Azure Blob Storage
- Azure Database for PostgreSQL
- Azure Key Vault
- Azure Monitor

17. KOLEJNOŚĆ WDROŻENIA
Etap 0 — walidacja
- wywiady z prawnikami;
- analiza realnych spraw;
- wybór wzorów;
- określenie KPI.

Etap 1 — prototyp
- wczytywanie dokumentów;
- OCR;
- obraz sprawy;
- ekstrakcja;
- podgląd źródła;
- prosty szkic.

Etap 2 — MVP
- opis zadania;
- fakty krytyczne;
- terminy;
- braki;
- szkic;
- kontrola;
- eksport.

Etap 3 — rozszerzenie
- warianty;
- kalendarz;
- kolejne typy spraw;
- kolejne wzory;
- integracje.

18. KPI
- czas do pierwszego szkicu;
- liczba poprawek prawnika;
- odsetek faktów wymagających korekty;
- odsetek fałszywych alarmów;
- odsetek pominiętych danych;
- koszt AI na sprawę;
- czas przetwarzania;
- liczba blokerów;
- odsetek eksportów bez blokerów.

19. OCENA
Nowa koncepcja jest lepsza, ponieważ:
- prawnik nie wybiera typu sprawy;
- prawnik opisuje zadanie własnymi słowami;
- system buduje plan pracy;
- każdy fakt prowadzi do źródła;
- wzory są proste i dostępne pod jednym przyciskiem;
- kontrola jest checklistą, a nie listą problemów.
