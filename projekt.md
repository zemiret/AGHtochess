Skład grupy:

13.03 godz. 13:00 - 

* Antoni Mleczko - zemiret
* Grzegorz Wcisło - grzegorz-wcislo
* Tomasz Zawadzki - tomekzaw
* Mateusz Hurbol - matix522
* Mateusz Naróg - narogm
* Arkadiusz Kraus - arkadiuss
* Maciej Mionskowski - maciekmm
* (Łukaz Oleś - lukasz.oles797) --(in progress)-> Piotr Matląg



# AGHtochess
Gierka inspirowana auto-battlerami

mail do prowadzącego: dajda@agh.edu.pl
mail do klienta: miidzik@agh.edu.pl

**TOP PRIORITY** MA DZIAŁAĆ - PAMIĘTAĆ, ŻE NIE MA DUŻO CZASU! nie p r z e k o m p l i k o w a ć

**TODO:**
1. *TASK:* Pograć sobie w takie gry, hehe:

* autochess
* teamfight tactics
* hearthstone battlegrounds

2. Przyjść z pomysłami już na technologie i pewnym osiągalnym pomysłem - można przygotować już wcześnej coś (e.g. repo, jakiś basic setup, etc)

# Design

* konto użytkownika
* profil gracza - statystyki gier (np. WINS/Looses, % odp poprawnie pytań, jednostki, etc, etc)
* rejestracja / logowanie
* ma to działać i jakoś wyglądać jednak - nie mogą być głowy prowadzących w wersji oficjalnej :(


# Rozgrywka

* rozgrywka sieciowa między graczami
* gracz - avatar, pasek życia
* board - szachownica
* jednostki do wyboru, do stawiania na szachownicę - na początek nie szarżować z jednostkami (kilka podstawowych)
* Jest np. 8 graczy, walą się w parach - wersja podstawowa: tylko 2 grczy
* last man standing - kto zostanie wygrywa
* wszystko się dzieje w turach - 30s na turę
* w trakcie gry możliwość podglądanie statów jednostki
* gracz ginie dopiero po serii rozgrywek z innymi graczami - (jak jego HP spadnie do 0)
* pojedyncza walka toczy się do momentu, gdy zginą wszystkie jednostki danego gracza - później hp się odlicza dla przegranego, np. na zasadzie tego ile zostało jednostek przeciwnikowi


1. każdy gracz ma czas na rozłożenie jednostek (nie widzi rozkładania ich przez przeciwnika) - współbieżne 30s dla każdego gracza
2. Rozpoczyna się bitwa - jednostki automatycznie sę naparzają ze soba
3. Po danej turze, pasek życia się redukuje zależnie od tego jak poszła tura
4. Zmiana gracza (w wersji rozszerzonej - podstawka to walka między 2 graczami tylko)


## "aspekt dydaktyczny" - rozwijanie jednostek

* ograniczony czas na pytania

Poprzez pytania "quizowe" można boostować jednostki.
Opcje (przykłady): 
* najprościej - pytania z jednej puli
* kilka rodzajów jednostek - każda jednostka ma swoją kategorię pytań
* różnocowanie po poziomie trudności - jednostki mają poziomy. Wyższe poziomy - trudniejsze pytania

1. boostowanie perków dla jednostek - np. zwiększamy celność **POPRZEZ ODPOWIEDŹ NA PYTANIE Z DZIEDZINY**
2. Odpowiadamy na pytanie i ciekawa opcja (nie konieczność) - nie znamy odpowiedzi. Dopiero jak zaczyna się walka, to widać czy dobra odpowiedź była czy nie.
3. Fajna mozliwość - dobra odpowiedź: + do staty, zła odpowiedź: - do staty
4. Inna możliwość - pytania pozwalają dokupować jednostki, a nie je boostować


## Jednostki

Generalnie się je dokupuje "per gra". Nie tak, że zostają dla gracza.
Ale jest tu dużo możliwości, np. 
* jeśli któraś przeżyje, to może zostać.
* Albo player może levelować i odblokowywać nowe jednostki, etc.

Podpowiedź od prowadzącego - co jednostka mogłaby mieć?
W uproszczeniu wszystkie jednostki mołyby atakować z dystansu
Atrybuty podstawowe:
* życie
* zasięg
* atak
* celność
* ranga?

# Technologia

Podpowiedź: NIE ZROBIĆ TEGO CZASEM REALTIME, BO TO SHITSTORM

* na pewno coś webowego: serwer + klienci. Musi być jakiś UI webowy

# Deliverable dla klienta:

* instrukcja jak to ustawić
* jakiś ładny deploy - chociażby skrypt instalacyjny

