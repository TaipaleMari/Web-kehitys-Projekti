# 1.Projektin idea

Projektin ideana oli suunnitella ja toteuttaa sovellus, joka tukee ja kehittää käyttäjän mielenterveyttä. Sovelluksen haluttiin motivoivan käyttäjää tekemään pieniä arkipäiväisiä tekoja, jotka lisäisivät käyttäjän toiminnallisuutta ja auttaisivat käyttäjää hänen mielenterveydellisissä haasteissaan. Tehtäviin haluttiin tuoda mukaan muokkausmahdollisuus, jotta ne tukisivat eri käyttäjien yksilöllisiä tarpeita. 

# 2.Kehityksen vaiheet

Lähdimme lähestymään käyttöliittymän tekemistä sillä, että saamme backendin ja tietokannan toimintaan. Ensin latasimme kaikki tarvittavat sovellukset backendiin node.js ja express. Tutkittuamme vaihtoehtoja päädyimme valitsemaan sovelluksen tietokannaksi SQLite3:n, koska pienen -kahden hengen- kehitystiimissä emme tarvitse monimutkaista tietokantarakennetta ja sovellus on pieni ja vasta aivan alkuvaiheessa. Asennettuamme sqlite3:n testasimme, että saamme tietokannan yhteyden backendiin. Tämä testattiin selaimella, localhost-portin 5000 kautta. 

Frontendiä varten asensimme react-kirjaston sovelluskansioon. Tästä lähdimme rakentamaan yhteyksiä eri .js-tiedostoihin. Teimme mm. home.js, joka on sovelluksen etusivu ja josta navigoidaan joko rekisteröitymis- tai kirjautumissivulle (register.js ja login.js). Rekisteröitymissivulle teimme yksinkertaisen lomakkeen, jolla haluttiin testata, että kaikki toimii yhdessä ja saimme luotua testikäyttäjän. 

Halusimme, että sisäänkirjautumisen jälkeen sovellus ohjaa käyttäjän omalle etusivulleen, joten loimme userDashboard.js ja tämän jälkeen testasimme aiemmin tekemämmällä testikäyttäjällä, että sisäänkirjautuminen ja ohjaus userDashboardille toimii. 
Seuraava askel oli lähteä tekemään sovelluksen tehtäväosuutta. 

Tässä vaiheessa jaoimme tehtävät: Mari yhdistäisi tähän asti toimivan github-repon azuren pilvipalveluun ja Noora lähtisi tekemään tehtäväsivua. Sovelluksen koodi (tämän repon master-haara) on onnistuneesti yhdistetty sekä azure app serviceen, että azure static web appiin. Molempia jouduttiin kokeilla sen vuoksi, että yhdistämisen jälkeen sen hetkiseen koodiin piti tehdä reittimuutoksia ja kumpikaan näistä palveluista ei toimi halutulla tavalla: azure web app ei saa yhteyttä frontendiin tai backendiin ollenkaan ja azure SWA ei saa yhteyttä tietokantaan, joten rekisteröinti tai sisäänkirjautminen ei onnistu. 

Turvataksemme sen, että voimme esitellä userDashboardin toimintaa edes localhost-portin kautta, päätimme pitää alkuperäisen koodin vielä erillään toisen kehittäjän omalla koneella. 

*Noora-tehtäväsivu* 



# 3.Käyttötapaukset

# 4.Käytetyt työtunnit

"linkki lokikirjaan"

# 5.Jatkoideat

# 6.Reflektointi

olisi ehkä ollut parempi liittää ensin github azure static web appiin ja lähteä sitä kautta kehittämään sovelluksen toiminnallisuuksia. Nyt teimme ensin osan toiminnallisuuksista, joiden koodaus ei käy yksi yhteen azure static web appin backend-toimintojen kanssa. 

Reitit menee ristiin eikä azure SWA tiedä mistä aloittaa? 
