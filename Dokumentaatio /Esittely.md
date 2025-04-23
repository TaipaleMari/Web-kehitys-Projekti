# 1.Projektin idea

Projektin ideana oli suunnitella ja toteuttaa sovellus, joka tukee ja kehittää käyttäjän mielenterveyttä. Sovelluksen haluttiin motivoivan käyttäjää tekemään pieniä arkipäiväisiä tekoja, jotka lisäisivät käyttäjän toiminnallisuutta ja auttaisivat käyttäjää hänen mielenterveydellisissä haasteissaan. Tehtäviin haluttiin tuoda mukaan muokkausmahdollisuus, jotta ne tukisivat eri käyttäjien yksilöllisiä tarpeita. 

# 2.Kehityksen vaiheet

Lähdimme lähestymään käyttöliittymän tekemistä sillä, että saamme backendin ja tietokannan toimintaan. Ensin latasimme kaikki tarvittavat sovellukset backendiin (node.js ja express). Tutkittuamme vaihtoehtoja päädyimme valitsemaan sovelluksen tietokannaksi SQLite3:n, koska pienen -kahden hengen- kehitystiimissä emme tarvitse monimutkaista tietokantarakennetta ja sovellus on pieni ja vasta aivan alkuvaiheessa. Asennettuamme sqlite3:n testasimme, että saamme tietokannan yhteyden backendiin. Tämä testattiin selaimella, localhost-portin 5000 kautta. 

Frontendiä varten asensimme react-kirjaston sovelluskansioon. Tästä lähdimme rakentamaan yhteyksiä eri .js-tiedostoihin. Teimme mm. home.js, joka on sovelluksen etusivu ja josta navigoidaan joko rekisteröitymis- tai kirjautumissivulle (register.js ja login.js). Rekisteröitymissivulle teimme yksinkertaisen lomakkeen, jolla haluttiin testata, että kaikki toimii yhdessä ja saimme luotua testikäyttäjän. 

Halusimme, että sisäänkirjautumisen jälkeen sovellus ohjaa käyttäjän omalle etusivulleen, joten loimme userDashboard.js ja tämän jälkeen testasimme aiemmin tekemämmällä testikäyttäjällä, että sisäänkirjautuminen ja ohjaus userDashboardille toimii. 
Seuraava askel oli lähteä tekemään sovelluksen tehtäväosuutta. 

Tässä vaiheessa jaoimme tehtävät: Mari yhdistäisi tähän asti toimivan github-repon azuren pilvipalveluun ja Noora lähtisi tekemään tehtäväsivua. Sovelluksen koodi (tämän repon master-haara) on onnistuneesti yhdistetty sekä azure app serviceen, että azure static web appiin. Molempia jouduttiin kokeilla sen vuoksi, että yhdistämisen jälkeen sen hetkiseen koodiin piti tehdä reittimuutoksia ja kumpikaan näistä palveluista ei toimi halutulla tavalla: azure web app ei saa yhteyttä frontendiin tai backendiin ollenkaan. Azure SWA toimii kyllä etu-, rekisteröitymis- ja kirjautumissivujen navigoinnin osalta, mutta ei saa yhteyttä tietokantaan, joten rekisteröinti tai sisäänkirjautuminen ei onnistu. 

Turvataksemme sen, että voimme esitellä userDashboardin toimintaa edes localhost-portin kautta, päätimme pitää alkuperäisen koodin vielä erillään toisen kehittäjän omalla koneella. 

Aluksi UserDashboard luotiin niin, että käyttäjä pystyi ainoastaan lisäämään, muokkaamaan tai poistamaan tehtäviä. Tässä tehtävien lisääminen ja poistaminen onnistui, mutta tehtävän muokkaaminen loi aina uuden tehtävän sen sijaan, että olisi muokannut olemassa olevaa. Lähdimme kehittämään tehtävälistaa siten, että samalla aloimme työstämään myös tehtävien tilan muuttamista valmiiksi. Loimme TaskList komponentin, jonka tarkoituksena oli keskittyä tehtävien näyttämiseen ja käsittelyyn. Näin ollen pääkomponenetti UserDashboard huolehti enemmän tietojen hakemisesta ja päivittämisestä. Aluksi loimme myös AddNewTask komponentin, mutta tämän toiminnot päätimmet yhdistää UserDashboardiin, kun kohtasimme haasteita tehtävälistan toteutuksessa. Tässä vaiheessa loimme css tiedostot sekä UserDashboardille, että TaskList komponentille. Lopulta haasteeksi muodostui, että sovelluksen Backend oli yhteydessä oikeaan tietokantatiedostoon, mutta taulun rakenne ei päivittynyt oikein. Tämän saimme selville POSTMAN ja SQL testauksien avulla, kun lähdimme selvittämään miksi tehtävien lisääminen tai tilan muuttaminen eivät toimineet. Käytimme myös paljon ```console.log``` toimintoa, jotta saisimme backend terminaaliin mahdollisimman paljon tietoa, että missä kohdassa koodia virhe esiintyy. Loppupäätelmäksi totesimme, että ongelma on todennäköisesti joko tietokannan välimuistista tai siitä, että taulu ylikirjoitetaan backendissä. Tiukka aikataulu aiheutti sen, että emme saaneet ongelmaa korjatuksi.



# 3.Käyttötapaukset

Seuraavaksi esittelemme toimimaan saadut käyttötapaukset alkuperäiseltä ja toimivalta versiolta. Viestit toiminnoista tulevat käyttäjälle näkyviin suoraan selaimessa.  

### Rekisteröinti
- käyttäjä painaa etusivulta "rekisteröidy"-painiketta ja hänet ohjataan register.js sivulle
- käyttäjä täyttää lomakkeeseen nimensä, sähköpostiosoitteensa ja luo salasanan.
- käyttäjä painaa "luo tili"-painiketta ja saa selaimeen viestin "käyttäjä rekisteröity!"
- mahdolliset virheet ja viestit:
    - käyttäjä ei ole täyttänyt kaikkia kenttiä "täytä kaikki kentät"
    - jos käyttäjä on jo olemassa "käyttäjänimi tai sähköposti on jo käytössä"
    - salasanan salaus ei onnistu "salauksen epäonnistuminen"
    - joku muu virhe "rekisteröinti epäonnistui"
 
### Sisäänkirjautuminen
- käyttäjä painaa etusivulta "kirjaudu sisään"- painiketta ja hänet ohjataan login.js-sivulle
- käyttäjä kirjoittaa rekisteröinnin yhteydessä antamansa sähköpostiosoitteen ja salasanan niille varattuihin kenttiin ja klikkaa "kirjaudu"-painiketta
- sovellus ohjaa käyttäjän omalle etusivulleen (dashboard)
- mahdolliset virheet ja vietit:
    - toinen kentistä tyhjä "täytä molemmat kentät"
    - käyttäjää ei löydy "virheellinen sähköposti tai salasana"
    - salasana ja sähköposti eivät täsmää "virheellinen sähköposti tai salasana"
    - tietokantaan ei saada yhteyttä "tietokantavirhe"
 
### Tehtävien selaaminen, valinta tai luominen
- Käyttäjä siirtyy kirjautumisen jälkeen automaattisesti UserDashboard sivulle, joka on käyttäjän etusivu ja näyttää käyttäjän lisäämät tehtävät. Jos tehtäviä ei ole lisätty, näkyy etusivulla teksti "Ei tehtäviä vielä. Lisää ensimmäinen tehtäväsi!"
- Käyttäjä lisää uuden tehtävän kirjoittamalla lomakkeella automaattisesti näkyviin kenttiin tehtävän otsikon ja kuvauksen, jonka jälkeen käyttäjä painaa "lisää tehtävä"-painiketta. (Tämä ominaisuus ei toimi halutusti)
      - Sovellus antaa virheilmoituksen "Tehtävän nimi ja kuvaus ovat pakollisia.", jos jompikumpi täytettävistä kentistä on tyhjänä.
- Käyttäjä voi muokata listalla olevaa tehtävää painamalla "muokkaa"- painiketta. Muokkauksen jälkeen käyttäjä painaa "tallenna" ja muutokset päivittyvät automaattisesti ja tehtävä näkyy muokattuna listassa.
- Tehtävän poistaminen onnistuu helposti painamalla "poista"-painiketta, jolloin tehtävä poistuu välittömästi listalta.
- Käyttäjä pystyy merkitsemään haluamansa tehtävän valmiiksi tehtävän nimen ja kuvauksen alla olevasta "merkitse valmiiksi" painikkeesta. (Tämän toimivuutta ei olla saatu missään vaiheessa oikeaksi, joten se miltä tehtävä näyttää tilan muuttamisen jälkeen, ei ole tiedossa tarkkaan kuvaukseen). 


### Vertailu vaiheen 1. käyttötapauksiin
 1. Rekisteröinti - toteutettu
 2. Sisäänkirjautuminen - toteutettu
 3. Käyttäjälle näytetään tehtäväsivulla lista, josta voi valita itselleen sopivat - ei onnistunut toteutus - syy: koodissa joku rivi ylikirjoittaa backendin valmiin listan
 4. Käyttäjä voi lisätä oman tehtävän - toteutettu, ei toimi halutusti, lisää tehtävän backendiin, mutta ei näytä lisättyä tehtävää frontendin userDashboardilla
 5. Käyttäjä voi muokata tehtävää - toteutettu  + käyttäjä voi poistaa tehtävän
 6. Käyttäjä voi merkitä tehtävän suoritetuksi - ei toteutettu - syy: tähän olisi tarvittu valmis tehtävälista, mutta sitä ei saatu toimimaan

# 4.Käytetyt työtunnit

Laskelmat: 
- vaiheeseen 1. Määrittely ja suunnittelu, käytimme yhteensä 4 h.
- vaiheeseen 2. Perusrunko ja päätoiminnallisuudet, käytimme yhteensä 35 h 45 min
- esittelyvaiheen suunnitteluun ja esitykseen: 5 h
- yhteensä 44 h 45 min

[Linkki lokikirjaan](https://github.com/TaipaleMari/Web-kehitys-Projekti/blob/main/Dokumentaatio%20/Lokikirja.md)

# 5.Jatkoideat

Mikäli meillä olisi ollut enemmän aikaa panostaa sovelluksen kehittämiseen, olisimme halunneet panostaa seuraaviin asioihin enemmän:
- sovelluksen ulkoasu
- navigointipalkki
- uloskirjautuminen
- valmis tehtävälistaus
- tehtävän valmiiksi merkitseminen ja tsemppiviesti käyttäjälle

Meillä olisi sovellukselle myös tulevaisuuden jatkokehitysideoita, joihin kuuluu mm. pelillisä elementtejä (pelihahmo, käyttäjän taso, palkinnot) tai tekoälyn lisääminen, jonka avulla saisimme käyttäjän userDashboardista vieläkin henkilökohtaisemman.  

# 6.Reflektointi

Saimme hyvin sovelluksen peruskomponentit valmiiksi ja meillä oli selkeä suunnitelma mihin suuntaan haluamme lähteä viemään projektia. Harmiksemme suuri osa loppuajasta kului ongelmien selvittelyyn emmekä saaneet sovelluksesta deadlineen mennessä sellaista kuin olisimme halunneet. 

Olisiko ollut parempi liittää ensin github azure static web appiin ja lähteä sitä kautta kehittämään sovelluksen toiminnallisuuksia? Nyt teimme ensin osan toiminnallisuuksista, joiden koodaus ei käy yksi yhteen azure static web appin backend-toimintojen kanssa, koodin reiteissä on ogelma jota emme saaneet selvitettyä. 

Myös tehtävätaulun luomisessa tuli ongelmia yhteydessä tietokantaan. Emme ole varmoja, vaikuttivatko nämä asiat toisiinsa. 

# 7. Linkki esittelyvideoon


