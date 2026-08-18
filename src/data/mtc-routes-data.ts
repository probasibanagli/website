// Precompiled MTC Bus Routes Data (1,240 routes & 1,000+ unique stops)
export interface MTCBusRoute {
  busNo: string;
  start: string;
  destination: string;
  routeStops: string;
  areaSection: string;
  stops: string[];
}

export const POPULAR_MTC_STOPS: string[] = [
  "Chennai Central",
  "CMBT",
  "Broadway",
  "T.Nagar",
  "Tambaram",
  "Tambaram West",
  "Tambaram East",
  "Adyar",
  "Guindy",
  "Velachery",
  "Thiruvanmiyur",
  "Avadi",
  "Poonamallee",
  "Anna Nagar West",
  "Mylapore",
  "Saidapet",
  "Vadapalani",
  "Koyambedu",
  "Chennai Egmore",
  "Kelambakkam",
  "Siruseri",
  "Sholinganallur",
  "Perambur",
  "Red Hills",
  "Villivakkam",
  "Chromepet",
  "Pallavaram",
  "Ambattur I.E",
  "Ambattur OT",
  "Besant Nagar"
];

export const ALL_MTC_STOPS: string[] = [
  "14 Shops",
  "A.G.S Office Colony",
  "Aadambakkam",
  "Aalathur IE",
  "Aasargana",
  "Adam market",
  "Adambakkam",
  "Adayar",
  "Adayar B.S",
  "Adyar",
  "Adyar B.S",
  "Adyar Bus Stand",
  "Adyar Depot",
  "Adyar G ate",
  "Adyar Gate",
  "Agaram",
  "Agaram Mel",
  "Agaram then",
  "Agaramthen",
  "AIR",
  "Ajanta",
  "Ajantha",
  "Akarambakkam",
  "Alamadhi",
  "Alwarpet",
  "Alwarthirunagar",
  "Amabattur IE",
  "Amabattur OT",
  "Amabttur OT",
  "Amarambe du",
  "Amarambedu",
  "Ambathur IE",
  "Ambathur O.T.",
  "Ambathur OT",
  "Ambattur",
  "Ambattur Estate",
  "Ambattur I.E",
  "Ambattur IE",
  "Ambattur Karukku",
  "Ambattur O.T",
  "Ambattur O.T.",
  "Ambattur OT",
  "AMBIT Park",
  "Amijikarai",
  "Aminijikarai",
  "Aminjikarai",
  "AMS",
  "Anagaputtur",
  "Anakaputh ur",
  "Anakaputhur",
  "Anakaputtur",
  "Andakuppam",
  "Andankuppam",
  "Andarkupp am",
  "Andarkuppam",
  "Angalamman Koil",
  "Anna Arch",
  "Anna Hospital",
  "Anna Nagar",
  "Anna Nagar East",
  "Anna nagar Rountana",
  "Anna nagar west",
  "Anna nagar West",
  "Anna Nagar West",
  "Anna NagarWest",
  "Anna Salai",
  "Anna square",
  "Anna Square",
  "Anna university",
  "Anna University",
  "Annasalai",
  "Annasquare",
  "Arakkambakkam",
  "Arani",
  "Aranvoyal",
  "Arasan kazhani",
  "Arasan Kazhani",
  "Arnavoyal",
  "Arnavoyal kuppam",
  "Arumbakkam",
  "Asharkana",
  "Ashok Leyeland",
  "Ashok Leyland",
  "Ashok nagar",
  "Ashok Nagar",
  "Ashok pillar",
  "Ashok Pillar",
  "Athipattu Pudhunagar",
  "Athipet ICF colony",
  "Avadi",
  "Avadi Kamaraj Nagar",
  "Avadi Market",
  "Avichi School",
  "Avvai Home",
  "Ayanavara",
  "Ayanavaram",
  "Ayapakkam",
  "Ayurveda Ashramam",
  "Ayyapakkam",
  "Azax",
  "Baikadai",
  "Balaji nagar",
  "Balaji Nagar",
  "Bandikavanoor",
  "Basin Bridge",
  "Basinbridge",
  "Beach Road",
  "Bell Nagar",
  "Bells Road",
  "Besant nagar",
  "Besant Nagar",
  "Besant Nagar/Thir uvanmiyur",
  "Besant Nagar/Thiruva nmiyur",
  "Bharath Electronics",
  "Bharath Engg. College",
  "Bharathi nagar",
  "Bharathinagar",
  "Bhondur",
  "Bhuvaneswari",
  "Blue Star",
  "Brindavan nagar",
  "Broadway",
  "Broadway /Am battur I.E (NS)",
  "Broadway, Chennai",
  "Burma Colony",
  "Butt road",
  "Butt Road",
  "Bypass road",
  "Camp road",
  "Camp Road",
  "CampRoad",
  "Canara bank",
  "Central",
  "Central Railway Station",
  "Check post",
  "Checkpost",
  "CheckpostVelachery",
  "Chembakkam Village",
  "Chembarabakkam",
  "Chembarambak kam",
  "Chembarambakkam",
  "Chemmenc hery",
  "Chemmenchery",
  "Chengalpat tu",
  "Chengalpattu",
  "Chennai Airport",
  "Chennai Beach",
  "Chennai Central",
  "Chennai Central.",
  "Chennai Citi Centre",
  "Chennai Egmore",
  "Chepauk",
  "Chetipedu",
  "Chetpet",
  "Chettinad Hospital",
  "Chindatripet",
  "Chindhatripet",
  "Chinmaya nagar",
  "Chinmaya Nagar",
  "Chinna Mangodu",
  "Chinnakuvanam",
  "Chinthamani",
  "Chitlapakkam",
  "Chittukadu",
  "Choolai P.O",
  "Choolai P.O.",
  "Choolaimedu",
  "Choolaipostoffice",
  "Chr omepet",
  "Chromepet",
  "Chromepet Lakshmi",
  "CIPET",
  "CIT nagar",
  "CIT Nagar",
  "CMBT",
  "Collector nagar",
  "Collector Nagar",
  "Convent",
  "Cowl Bazaar",
  "CPCL",
  "CPT",
  "D.M.S",
  "Dasaprakash",
  "Dasarathapuram",
  "Defence Accounts office",
  "Defence Colony",
  "Devoton",
  "Dhandeswarnagar",
  "DMDK Office",
  "DMS",
  "Doveton",
  "DPI",
  "Dunlop",
  "Durga nagar",
  "Eachangadu",
  "East Tambaram",
  "Echangadu",
  "ECR",
  "Eechangadu",
  "Egmore",
  "EgmoreR.S",
  "Ekkadttuth angal",
  "Ekkadttuthangal",
  "Ekkadu Kandigai",
  "Ekkadutha ngal",
  "Ekkaduthangal",
  "Ekkattuthangal",
  "Elampakkam",
  "Elango Nagar (Collector Nagar)",
  "Elango nagar officer colony",
  "Elavur",
  "Elephant gate",
  "Elephantgate",
  "Ennore",
  "Ennore Thermal PowerStation",
  "Equavarpalayam",
  "Ernavoor",
  "Ernavoor gate",
  "Ernavoor Gate",
  "Ethiraj College",
  "Ettayapuram",
  "Express avenue",
  "Express Avenue",
  "Ezhilagam",
  "Fore Shore Estate",
  "Foreshore Estate",
  "G.K.M colony",
  "Gandhi mandapam",
  "GandhiMandapam",
  "Ganesh Nagar",
  "Gemini",
  "Gerugumbakkam",
  "Gnayaru",
  "Golden Flats",
  "Gopalapuram",
  "Gopalapuram playground",
  "Govardhanagiri",
  "Govardhangiri",
  "Goverdhangiri",
  "Guduvanch erry",
  "Guduvanch ery",
  "Guduvancherry",
  "Guduvanchery",
  "Guindy",
  "Guindy Estate",
  "Guindy I.E",
  "Guindy Race Course",
  "Guindy TV K Estate",
  "Guindy TVK Estate",
  "GuindyEstate",
  "GuindyI.E",
  "Gummidipoondi",
  "Gummidipoondi R.S.",
  "Gunidy",
  "Gunidy Race Course",
  "Hasthinapu ram",
  "Hasthinapuram",
  "High Court",
  "Highcourt",
  "HighCourt",
  "HVF Hospital",
  "HVF Main Gate",
  "I.O.C",
  "I.O.C (Indian Oil Corporation)",
  "ICF",
  "ICF (Integral Coach Factory)",
  "IIT Chennai",
  "Inchangadu",
  "Indira Nagar",
  "Injambakkam",
  "Irrungattukottai",
  "Irrunkatturkottai",
  "IRT",
  "Irumbuliyur",
  "Irungatukottai",
  "Irunkattukottai",
  "Iyyapantha ngal",
  "Iyyapanthangal",
  "Iyyappanth angal",
  "Iyyappanthangal",
  "Iyypanthangal",
  "Iyyppanthangal",
  "Jaffarkhanpet",
  "Jafferkhanpet",
  "Jain College",
  "Jamalaya",
  "Jamaliya",
  "Janappan chathramx road",
  "Janappan chathramx Road",
  "Janappan Chathramx road",
  "Jaya College",
  "Jayanthi",
  "Joint Office",
  "Jothi nagar",
  "Jothi Nagar",
  "K K Nagar",
  "K.K. Nagar",
  "K.K.Nagar",
  "K.K.Nagar BS",
  "K4 Police station",
  "Ka nnagi statue",
  "Kadambathur",
  "Kadapakkam",
  "Kadapery",
  "Kadavoor",
  "Kaduveti",
  "Kaiveli",
  "Kakallur",
  "Kakkan Bridge",
  "Kal mandapam",
  "Kalavakkam",
  "Kallikuppa",
  "Kallikuppam",
  "Kallur",
  "Kalmandapam",
  "Kalmandappam",
  "Kalyani Hospital",
  "Kamakshi Temple",
  "Kamaraj Nagar",
  "Kamarajapuram",
  "Kamarajpuram, Anakaputhur",
  "Kamatchi Hospital",
  "Kambar Arangam",
  "Kanathur",
  "Kanchipuram",
  "Kanchivoyal",
  "Kandan chavadi",
  "Kandigai",
  "Kaniyamman Nagar",
  "Kannadapalayam",
  "Kannadasan Nagar",
  "Kannagi nagar",
  "Kannagi Nagar",
  "Kannagi statue",
  "Kannagi Statue",
  "Kannaki Nagar",
  "Kannaki Statue",
  "Kannigaipair",
  "Kannigapuram",
  "Karaiyanchavadi",
  "Karanai",
  "Karanodai",
  "Karappakkam",
  "Karasangal",
  "Karayan chavadi",
  "Kargil Nagar",
  "Karumbakkam",
  "Kasimedu",
  "Kathipara",
  "Katrambak kam",
  "Katrambakkam",
  "Kattu Koot road",
  "Kattu Koot Road",
  "Kattukoot rd",
  "Kattupakkam",
  "Kattupalli",
  "Kattupalli Village",
  "Kavangarai",
  "Kavanoor Koot Road",
  "Kavarapettai",
  "Kaviarasu Kannadasan Nagar",
  "Kaviarasu Kannadhas an Nagar",
  "Kaviarasu Kannadhasan Nagar",
  "Kayar",
  "Kedar Hospital",
  "Keelkattalai",
  "Keerapakkam",
  "Kelamba kkam",
  "Kelambakk am",
  "Kelambakkam",
  "Kellys",
  "Kilakaranai",
  "Kilakaranai Koot road",
  "Kilanur",
  "Kilkatalai",
  "Kilkattalai",
  "Kilkondaiyar",
  "Kilkottaiyur",
  "Kilpauk",
  "Kilpauk Gardens",
  "Kizh Nallathur",
  "KK Nagar",
  "KMC",
  "Kodambakkam",
  "Kodambakkam Power house",
  "Kolahur",
  "Kolapakkam",
  "Kolathur",
  "Koovam",
  "Koovoor",
  "Korattur",
  "Korukkupet",
  "Korukkupettai",
  "Kosappur",
  "Kosavampettai",
  "Kosavapalayam",
  "Kottivakkam",
  "Kotturpuram",
  "Kovalam",
  "Kovilambakkam",
  "Kovilancherry",
  "Kovilpadagai",
  "Kovoor",
  "Kovur",
  "Koyambed uMarket",
  "Koyambedu",
  "Koyambedu Junction",
  "Koyambedu Ma rket",
  "Koyambedu market",
  "Koyambedu Market",
  "KoyambeduMarket",
  "Kozhipannai",
  "Kumanachavadi",
  "Kumanan chavadi",
  "Kumananchavadi",
  "Kumaran Kundram",
  "Kumaran Nagar",
  "Kundrathur",
  "Kundrathur B.S",
  "Kundrathur Mu rugan Temple",
  "Kundrathur Murugan koil",
  "Kundrathur Murugan Temple",
  "Kunnam",
  "Kuppam",
  "Kuthambak kam",
  "Kuthambakkam",
  "L.I.C",
  "L&T Harbour",
  "LFC",
  "Liberty",
  "LIC",
  "Little mount",
  "Little Mount",
  "Loyalla College",
  "Loyallo College",
  "Loyola college",
  "Loyola College",
  "Lucas",
  "Lucas TVS",
  "Luz",
  "LUZ",
  "M.K.B Nagar",
  "M.K.B Nagar East",
  "Maathur",
  "Madambakkam",
  "Madambakkam koot road",
  "Madanakuppam",
  "Madarpakkam",
  "Madhavaram",
  "Madhavaram Milk",
  "Madhavaram Milk colony",
  "Madhavaram Milk Colony",
  "Madhuravoyal",
  "Madhya Kailash",
  "Madiakailash",
  "Madipakka mB.S.",
  "Madipakkam",
  "Madipakkam BS",
  "Madipakkam Koot rd",
  "Madipakkam koot Road",
  "Madipakkam Koot road",
  "Madipakkam Koot Road",
  "MadipakkamB.S .",
  "Madippakkam",
  "Madura voyal",
  "Maduramangalam Koot road",
  "Madurapakkam",
  "Maduravoyal",
  "Mahalingapuram",
  "Maharani",
  "Malanthur",
  "Mamallapu ram",
  "Mamallapuram",
  "Mambakkam",
  "Mambakkam Kulam",
  "Mambakkam Rice mill",
  "Manali",
  "Manali Koot road",
  "Manali new town",
  "Manali New Town",
  "Manamathi",
  "Manapakkam",
  "Manavalan Nagar",
  "Mandaveli",
  "Mandaveli BS",
  "Mangadu",
  "Manimangalam",
  "Mannadi",
  "Mannivakkam",
  "Mannivakkam/ Vandalur Gate",
  "Mannur",
  "Mappedu",
  "Maraimalai nagar",
  "Maraimalai Nagar",
  "Maraimalai Nagar I.E",
  "Maraimalai nagar IE",
  "Maraimalai Nagar IE",
  "Marina",
  "Marina Beach",
  "Maternity Hospital",
  "Mathruvayoil",
  "Mathur",
  "Mathur Koot road",
  "Mathur MMDA",
  "Mathuravoyal",
  "Mattumandai",
  "Medavakka",
  "Medavakkam",
  "MEDAVAKKAM",
  "Medavakkam Junction",
  "Medavakkam koot road",
  "Medavakkam Koot road",
  "Medavakkam Koot Road",
  "Meenambakkam",
  "Meenambe du",
  "Mel Nallathur",
  "Melapedu",
  "Melkondaiyur",
  "Melkottaiyur",
  "Menambedu",
  "Meppedu",
  "Meppur",
  "MEPZ",
  "Mettukandigai",
  "Mettukuppam",
  "Mettupalayam",
  "Mettupalayam Rd JN",
  "Meyyur",
  "MFL",
  "MGM",
  "MGR nagar",
  "MGR Nagar",
  "Minjur",
  "Minjur B.D.O",
  "Minjur N.T.",
  "Minjur Ne w Bus Stand",
  "Mint",
  "MKB Nagar",
  "MKB Nagar East",
  "MMC School",
  "MMDA Colony",
  "Mogalivakk am",
  "Mogalivakkam",
  "Mogappair East",
  "Mogappair West",
  "Moolakadai",
  "Moolakarai",
  "Moondram kattalai",
  "Moovarasampet",
  "Moulivakkam",
  "Mount",
  "MR Nagar",
  "MRC Nagar",
  "Mudichur",
  "Mugappair East",
  "Mugappair West",
  "Mullai Nagar",
  "Murkancherry",
  "Music Academy",
  "Muthamil Nagar",
  "Muthamil Nagar (Kodungaiyur)",
  "Muthapudupet",
  "Muttukadu",
  "Muttukadu boat yard",
  "Mylapore",
  "N.G.O Colony B.S",
  "N.G.O. Colony",
  "Nadhamuni",
  "Naduveerapattu",
  "Nagakeni",
  "Nagalkeni",
  "Nallur",
  "Nandambakkam",
  "Nandanam",
  "Nanganallur",
  "Napalayam",
  "NAPALAYAM",
  "Narasinprm M Koil",
  "Narayanapuram",
  "Nataraja theatre",
  "Natarajatheatre",
  "Nathamuni",
  "Navallur",
  "Navalu",
  "Navalur",
  "Nedugudram",
  "Neelangarai",
  "Nehru nagar(Chromepet)",
  "Nehrusilai",
  "Nemam",
  "Nemilicheri",
  "Nerkundram",
  "Nesapakkam",
  "Nethaji circle",
  "Nethaji Circle(byepass)",
  "New Avadi road",
  "New Avadi Road",
  "New Erumai Vettipalayam",
  "NGO Colony",
  "Noothencherry",
  "NSK",
  "NSK nagar",
  "Nukkanpalayam",
  "Okkiam",
  "Okkiam Thoraippak kam",
  "Okkiam Thoraippakkam",
  "Okkiam Thorapakkam",
  "Okkium Thoraipakk am",
  "Okkium Thoraipakkam",
  "Old Perugalathur",
  "Old Perungalathur",
  "Oonamancheri",
  "Oorapakkam",
  "Oorapakkam School",
  "Oorapakkam Tea shop",
  "Oragadam",
  "Oragadam Koot Road",
  "Otteri",
  "Otterri",
  "Ottiambakk am",
  "Ottiambakkam",
  "Ottiyambak kam",
  "Ottiyambakkam",
  "P oonamallee",
  "P R & sons",
  "Pa rry's Corner",
  "Padappai",
  "Padhuvancherry",
  "Padi",
  "Padiyanallur",
  "Padur",
  "Paduvancherry",
  "Paiyanoor",
  "Pakkam",
  "Palavakkam",
  "Pallavan Road",
  "Pallavaram",
  "Pallikaranai",
  "Pallikkaranai",
  "Pallvaram",
  "Palmgrove",
  "Pammal",
  "Pammal Kamarajapuram",
  "Panagal park",
  "Panagal Park",
  "Panaiyur",
  "Pandy Kavanoor Rd JN",
  "Pangal Park",
  "Paranipathur",
  "Paraniputhur",
  "Parivakkam",
  "Parivakkam Rd JN",
  "Parry's Corner",
  "Parrys",
  "Parvathi Nagar (Kodungaiyur)",
  "Parvathy Nagar (Kodungaiyur)",
  "Pathirivedu",
  "Pattabiram",
  "Pattalam",
  "Pattinapakkam",
  "Pattravakkam",
  "Pattunool",
  "Pattunool Chatiram",
  "Pattunul Chatiram",
  "Pattur",
  "Pazhanthandalam",
  "Pazhanthandalam Koot road",
  "Pazhavanthangal",
  "Pazhavanthangal Station",
  "Pazhaverka du",
  "Pazhaverkadu",
  "Pennalur EB",
  "Perambakk am",
  "Perambakkam",
  "Perambur",
  "Perambur B.S",
  "Perambur market",
  "Peravallur",
  "Peravallur Kumaran Nagar",
  "Peri yapannicherry",
  "Periamedu",
  "Periamet",
  "Periyakottambedu",
  "Periyamedu",
  "Periyapalay am",
  "Periyapalayam",
  "Periyapalayam Koot road",
  "Periyapannicherry",
  "Periyar Colony",
  "Periyar nagar",
  "Periyar Nagar",
  "Periyar Road",
  "Perliyambakkam",
  "Perugalathur",
  "Perugudi",
  "Perumalpattu",
  "Perumbakkam",
  "Perumbedu",
  "Perumbedukup pam",
  "Perungalathur",
  "Perungudi",
  "Perunthandalam",
  "Pillai chatiram",
  "Pillaipakkam",
  "Po nmar",
  "Polivakkam",
  "Pondhur",
  "Pondur",
  "Pondy bazaar",
  "Pondy Bazaar",
  "Pondy Bazzar",
  "Ponmar",
  "Ponneri",
  "Poombuhar",
  "Poombukar",
  "Poonamallee",
  "Poonammallee",
  "Poondi",
  "Poondi Bazar",
  "Poonthandalam",
  "Poorivakkam",
  "Porur",
  "Porur Powerhouse",
  "Power house",
  "Pozhichalur",
  "Ptaaalam",
  "Pudhuchatiram",
  "Pudhupakkam",
  "Pudhupattu",
  "Pudhupet",
  "Pudhur",
  "Pudupakkam",
  "Pudur",
  "Puduvallur Jn.",
  "Puduvayal",
  "Pulianthope",
  "Pulianthopu Police station",
  "Puliantope",
  "Pulicut",
  "Purasaivakkam",
  "Purasaiwak kam",
  "Purasaiwakkam",
  "Purasawakam",
  "Purasawakkam High Road",
  "Pushpa nagar",
  "Pushpa Nagar",
  "Puthagaram",
  "Puzhal",
  "Puzhithivakkam",
  "Puzhudiva kkam BS",
  "Puzhudivakkam",
  "Puzhudivakkam BS",
  "Puzhuthiva kkam",
  "Puzhuthivakkam",
  "Q.M.C",
  "QMC",
  "Railway Quarters",
  "Rajaka dai",
  "Rajakadai",
  "Rajakeelpakkam",
  "Rajakilpakkam",
  "Rajbhavan",
  "Rajiv Gandhi Salai",
  "Ram Nagar",
  "Ramachandra Hospital",
  "Ramapuram",
  "Ramasamy nagar",
  "Rangarajapuram",
  "Rathinamangalam",
  "Rathnamangalam",
  "Red hills",
  "Red Hills",
  "Redhills",
  "RedHills",
  "Redial Road",
  "Regal",
  "Rengarajapuram",
  "Rettambedu",
  "Retteri",
  "RMZ",
  "Roundtana",
  "Rountana",
  "Royapetah",
  "Royapettah",
  "Royapuram bridge",
  "Royapuram M.C",
  "S.I.E.T",
  "S.Kolathur",
  "S.P.KOIL",
  "S.V.Chatiram",
  "Sadhanapuram",
  "Saidap et",
  "Saidapet",
  "Saidapet W est",
  "Saidapet West",
  "Saidepet",
  "Saidpet",
  "Saligramam",
  "Samiarmadam",
  "Samthuvapuram",
  "Sanskrit College",
  "Santhome",
  "Santhosapuram",
  "Sapphire",
  "Sarma Nagar",
  "Sathiyamoorthy Nagar",
  "SATHIYAMOORTHY NAGAR",
  "Sathyamoorthy nagar",
  "Sathyamoorthy Nagar",
  "Sathyastudio",
  "Saveetha Engineering College",
  "Sayani",
  "Secretariat",
  "Secretrariat",
  "Seeneerkuppam",
  "Selaiyur",
  "Sembakkam",
  "Semmenche ri",
  "Semmencheri",
  "Senthil Nagar",
  "Serapanacherri",
  "Serapanancherri",
  "Sevapet",
  "Shankar Nagar, Pammal",
  "Shanthi Colony",
  "Shanthi Theater",
  "Sharma nagar",
  "Sharma Nagar",
  "SHIVASHANMUGAPURAM",
  "Sholi nganallur",
  "Sholinganal lur",
  "Sholinganallur",
  "Shozhingan allur",
  "Shozhinganallur",
  "SIDCO",
  "SIET",
  "Simpson",
  "Singaperumal Koil",
  "Sirukalathur",
  "Siruseri",
  "SIRUSERI",
  "SiruseriSIP COT",
  "SiruseriSIPCOT",
  "Sirusery",
  "Siruvapuri",
  "Sith alapakkam koot road",
  "Sithalapakkam",
  "Sithalapakkam Housing board",
  "Sithalapakkam koot road",
  "Sithalapakkam Koot road",
  "SithalapakkamT NHB Colony",
  "Somangalam",
  "Somangalam Koot road",
  "Sri ram Engg college",
  "Srinivasa",
  "Srinivasa theater",
  "Srinivasa Theater",
  "Srinivasanagar",
  "Sriperumbu dur",
  "Sriperumbudur",
  "SRM University",
  "SRMC",
  "SRMC(Porur)",
  "SRP",
  "SRP tools",
  "SRP Tools",
  "ST Thomas Mount",
  "St. Thomas Mount",
  "St.Thomas Mount",
  "Stanley",
  "Stanley Hospital",
  "Ste rling road",
  "Stella Maris College",
  "Sterling road",
  "Sterling Road",
  "Sterling Road/College Road",
  "Sumtheramedu Koot road",
  "Sundaransozhapuram",
  "Sung uvarchatiram",
  "Sunguvarch athiram",
  "Sunguvarch atiram",
  "Sunguvarch atram",
  "Sunguvarchathir am",
  "Sunguvarchathiram",
  "Sunguvarchatiram",
  "Sunnabu kulathur",
  "Sunnabukulam",
  "Surapedu",
  "T. Acharavakkam",
  "T. Nagar",
  "T. Nagar/Ma ndaveli",
  "T. Nagar/Mandav eli",
  "T.B.Sanatorium",
  "T.Nagar",
  "T.V.K Nagar",
  "Tamaraipakkam",
  "Tambaram",
  "Tambaram East",
  "Tambaram Sanatorium",
  "Tambaram West",
  "TambaramWest",
  "Taramani",
  "Taylors road",
  "Taylors Road",
  "Teacherscolony",
  "Teynampet",
  "Thachur Koot Road",
  "Thaiyur",
  "Thaiyur Koman Nagar",
  "Thalambur",
  "Thalankuppam",
  "Thambuchetty St.",
  "Thandalam",
  "Thandalam Koot road",
  "Thandarai",
  "Thandurai",
  "Thapal petti",
  "Thapal Petti",
  "Thatchur Koot road",
  "Thathamanji",
  "Thathankuppam",
  "Thathanmanji",
  "Theradi",
  "Therady",
  "Thi ruvanmiyur",
  "Thiru vi ka nagar",
  "Thiru.Vi.Ka Nagar",
  "Thirumalai Nagar",
  "Thirumangalam",
  "Thirumangalam koot road",
  "Thirumazhisai",
  "Thirumudi vakkam",
  "Thirumudivakk am",
  "Thirumudivakkam",
  "Thirumulaivoyil",
  "Thirumullaivoy al colony",
  "Thirumullaivoyal",
  "Thirumullaivoyil",
  "Thirunamiy ur",
  "Thirunamiyur",
  "Thiruneermalai",
  "Thirunindr avur",
  "Thirunindravur",
  "Thiruninravur",
  "Thirupalaivanam",
  "Thirupatchur",
  "Thirupporur",
  "Thiruvallur",
  "Thiruvallur - Pandur",
  "Thiruvamiyur",
  "Thiruvancherry",
  "Thiruvanmi yur",
  "Thiruvanmi yur/Adyar",
  "Thiruvanmi yur/Besant Nagar",
  "Thiruvanmiyur",
  "Thiruvanmiyur/ Adyar",
  "Thiruvanmyur",
  "Thiruvedanthai",
  "Thiruverka du",
  "Thiruverkadu",
  "THIRUVETRIYUR B.S",
  "Thiruvidanthai",
  "Thiruvotriy ur",
  "Thiruvotriyur",
  "Thiruvotriyur R.S",
  "Thiruvottiy ur",
  "Thiruvottiyur",
  "Thiruvottri yur",
  "Thiruvottriyur",
  "Thoraipakkam",
  "Thoraippakkam",
  "Thorapakkam",
  "Thousand lights",
  "Thousand Lights",
  "Thriumangalam",
  "Tidel park",
  "Tidel Park",
  "Tiruvottiyur",
  "Tollgate",
  "TONDAIAYRPET",
  "Tondaripet",
  "Tondiarpet",
  "Tondirapet",
  "Triplicane",
  "Triplicane P.O",
  "TSR Rajalakshmi Nagar",
  "TVK Nagar",
  "TVS",
  "U.Mandaveli",
  "Udhayam",
  "Udhayam Theater",
  "Ullagaram",
  "Urapakkam",
  "Uthandi",
  "Uthukkottai",
  "V House",
  "V Nagar",
  "V. House",
  "V. Nagar",
  "V.House",
  "V.M.Street",
  "V.Nagar",
  "V.Z00",
  "Vadakkupet",
  "Vadaku Malaiyamb akkam",
  "Vadaku Malaiyambakkam",
  "Vadamadurai",
  "Vadamangalam",
  "Vadanemili",
  "Vadapalani",
  "Vadapalani Koil",
  "Valasar awakkam",
  "Valasara wakkam",
  "Valasarawakkam",
  "Vallakkottai",
  "Vallakottai",
  "Vallalar nagar",
  "Vallalar Nagar",
  "Vallalarnagar",
  "Valluvar kottam",
  "Valluvar Kottam",
  "Valluvarkottam",
  "Valsarawakkam",
  "Vanagaram",
  "Vanavil",
  "Vandaloor Zoo",
  "Vandalor Zoo",
  "Vandalur",
  "Vandalur Gate",
  "Vandalur Zoo",
  "Vandalur Zoo/Arignar Anna Zoological Park",
  "Vani mahal",
  "Vanimahal",
  "Vannanthurai",
  "Vanuvampet",
  "Vanuvampettai",
  "Varadharaja Theater",
  "Vavin",
  "Vazhuthulapedu",
  "Veerapuram",
  "Velacherry",
  "Velachery",
  "Velachery Bypass road",
  "Velachery MRTS",
  "Velankkani church",
  "Velappan chavadi",
  "Velappanchavadi",
  "Vellaikal",
  "Vellakal",
  "Vellanur",
  "Vellapanchavadi",
  "Vellavedu",
  "Vembedu",
  "Vengaivasal",
  "Vengaivasal P.H. Centre",
  "Vengal",
  "Vengal Koot road",
  "Vengambakkam",
  "Vengambakkam koot road",
  "Venkatapuram",
  "Venus",
  "Vepampattu",
  "Vepery",
  "Veppampat tu",
  "Veppampattu",
  "Villivakkam",
  "Vinayagapu ram",
  "Vinayagapuram",
  "Virugamabakkam",
  "Virugambakkam",
  "Vishnuvakkam",
  "Vivekananda House",
  "Vyasarpadi",
  "Vysarpadi",
  "Walaja Road",
  "Wallaja Road",
  "Wallajabad",
  "Wallajah road",
  "Washermanpet",
  "Wavin",
  "Wesley School",
  "West K.K.nagar",
  "West Mambalam",
  "West Saidapet",
  "West Tambaram",
  "WPT",
  "Zambazzar",
  "Zimson",
  "Zion School",
  "Zoo"
];

export const MTC_BUS_ROUTES: MTCBusRoute[] = [
  {
    "busNo": "M5",
    "start": "Adyar",
    "destination": "Kelambakkam",
    "routeStops": "Thiruvanmiyur, Perungudi, Sholinganallur",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "Thiruvanmiyur",
      "Perungudi",
      "Sholinganallur",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "19D",
    "start": "Adyar",
    "destination": "Chemmenchery",
    "routeStops": "Thiruvanmiyur, SRP, Perungudi",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "Thiruvanmiyur",
      "SRP",
      "Perungudi",
      "Chemmenchery"
    ]
  },
  {
    "busNo": "19K",
    "start": "Adyar Bus Stand",
    "destination": "Siruseri",
    "routeStops": "Thiruvanmiyur, Perungudi, Navalur, Thalambur",
    "areaSection": "Adyar",
    "stops": [
      "Adyar Bus Stand",
      "Thiruvanmiyur",
      "Perungudi",
      "Navalur",
      "Thalambur",
      "Siruseri"
    ]
  },
  {
    "busNo": "19P",
    "start": "Adyar Bus Stand",
    "destination": "Kelambakkam",
    "routeStops": "SRP Tools, Perugudi, Sholinganallur, Navalur, Thalambur, Sirusery, Pudupakkam, Chettinad Hospital",
    "areaSection": "Adyar",
    "stops": [
      "Adyar Bus Stand",
      "SRP Tools",
      "Perugudi",
      "Sholinganallur",
      "Navalur",
      "Thalambur",
      "Sirusery",
      "Pudupakkam",
      "Chettinad Hospital",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "519 cut",
    "start": "Adyar",
    "destination": "Thirupporur",
    "routeStops": "SRP tools, Sholinganallur, Kelambakkam, Kalavakkam",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "SRP tools",
      "Sholinganallur",
      "Kelambakkam",
      "Kalavakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "519A cut",
    "start": "Adyar",
    "destination": "Aalathur IE",
    "routeStops": "SRP tools, Sholinganallur, Kelambakkam, Thirupporur",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "SRP tools",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur",
      "Aalathur IE"
    ]
  },
  {
    "busNo": "519T",
    "start": "Adyar",
    "destination": "Thaiyur",
    "routeStops": "Perungudi,Sholinganallur,Kelambakka m",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "Perungudi",
      "Sholinganallur",
      "Kelambakkam",
      "Thaiyur"
    ]
  },
  {
    "busNo": "522",
    "start": "Adyar",
    "destination": "Manamathi",
    "routeStops": "Perungudi, Sholinganallur, Kelambakkam, Thirupporur",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "Perungudi",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur",
      "Manamathi"
    ]
  },
  {
    "busNo": "568",
    "start": "Adyar",
    "destination": "Mamallapuram",
    "routeStops": "Rajiv Gandhi Salai",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "Rajiv Gandhi Salai",
      "Mamallapuram"
    ]
  },
  {
    "busNo": "C51",
    "start": "Adyar",
    "destination": "Tambaram West",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Sholinganallur, ECR, Injambakkam, Thiruvanmyur",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Sholinganallur",
      "ECR",
      "Injambakkam",
      "Thiruvanmyur",
      "Tambaram West"
    ]
  },
  {
    "busNo": "588",
    "start": "Adyar",
    "destination": "Mamallapuram",
    "routeStops": "Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "Adyar",
    "stops": [
      "Adyar",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "Mamallapuram"
    ]
  },
  {
    "busNo": "251A",
    "start": "Agaramthen",
    "destination": "T.Nagar",
    "routeStops": "Bharath Engg. College, Camp Road, Kamarajapuram, Medavakkam,",
    "areaSection": "Agaramthen",
    "stops": [
      "Agaramthen",
      "Bharath Engg. College",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "T.Nagar"
    ]
  },
  {
    "busNo": "51A",
    "start": "Agaramthen",
    "destination": "Tambaram East",
    "routeStops": "Camp Road",
    "areaSection": "Agaramthen",
    "stops": [
      "Agaramthen",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "20K",
    "start": "Ambattur I.E",
    "destination": "Thiruverkadu",
    "routeStops": "",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "20P",
    "start": "Ambattur I.E",
    "destination": "Poonamallee",
    "routeStops": "Ayapakkam, Saveetha Engineering College, Kumananchavadi, Karaiyanchavadi",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Ayapakkam",
      "Saveetha Engineering College",
      "Kumananchavadi",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "61A",
    "start": "Ambattur I.E",
    "destination": "Melapedu",
    "routeStops": "Dunlop, Amabttur OT, Thirumullaivoyil, Avadi, HVF Hospital",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Dunlop",
      "Amabttur OT",
      "Thirumullaivoyil",
      "Avadi",
      "HVF Hospital",
      "Melapedu"
    ]
  },
  {
    "busNo": "65B",
    "start": "Ambattur I.E",
    "destination": "Poonamallee",
    "routeStops": "Karayan chavadi, Seeneerkuppam, Goverdhangiri, Avadi Market, Avadi, Thirumullaivoyal, Ambathur OT, Canara bank, Dunlop, AMBIT Park",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Karayan chavadi",
      "Seeneerkuppam",
      "Goverdhangiri",
      "Avadi Market",
      "Avadi",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Canara bank",
      "Dunlop",
      "AMBIT Park",
      "Poonamallee"
    ]
  },
  {
    "busNo": "65C",
    "start": "Ambattur I.E",
    "destination": "Pakkam",
    "routeStops": "Dunlop, Ambattur OT, Thirumulaivoyil, Avadi, Pattabiram, Jaya College, Thirunindravur",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Dunlop",
      "Ambattur OT",
      "Thirumulaivoyil",
      "Avadi",
      "Pattabiram",
      "Jaya College",
      "Thirunindravur",
      "Pakkam"
    ]
  },
  {
    "busNo": "65E",
    "start": "Ambattur I.E",
    "destination": "Poonamallee",
    "routeStops": "Ambattur OT, Avadi, Kamaraj Nagar, Karaiyanchavadi",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi",
      "Kamaraj Nagar",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "65P",
    "start": "Ambattur I.E",
    "destination": "Pattabiram",
    "routeStops": "Ambattur OT, Avadi Market, Poonamallee, Thandurai",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi Market",
      "Poonamallee",
      "Thandurai",
      "Pattabiram"
    ]
  },
  {
    "busNo": "65R",
    "start": "Ambattur I.E",
    "destination": "Iyyapanthangal",
    "routeStops": "Ambattur OT, Avadi Market, Karaiyanchavadi, Kumananchavadi",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi Market",
      "Karaiyanchavadi",
      "Kumananchavadi",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "70D",
    "start": "Ambattur I.E",
    "destination": "MadipakkamB.S .",
    "routeStops": "Collector Nagar, CMBT, Vadapalani, Ashok Nagar, Guindy, Velachery, Ram Nagar",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Velachery",
      "Ram Nagar",
      "MadipakkamB.S ."
    ]
  },
  {
    "busNo": "D70",
    "start": "Ambattur I.E",
    "destination": "Velachery",
    "routeStops": "Collector Nagar, CMBT, Vadapalani, Ashok nagar, Guindy, Checkpost, Velachery Bypass road",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Checkpost",
      "Velachery Bypass road",
      "Velachery"
    ]
  },
  {
    "busNo": "M70V",
    "start": "Ambattur I.E",
    "destination": "Guindy TVK Estate",
    "routeStops": "Collector Nagar, Vadapalani",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Collector Nagar",
      "Vadapalani",
      "Guindy TVK Estate"
    ]
  },
  {
    "busNo": "M270",
    "start": "Ambattur I.E",
    "destination": "Puzhuthivakkam",
    "routeStops": "Aadambakkam, Guindy, Udhayam, CMBT, Thirumangalam",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Aadambakkam",
      "Guindy",
      "Udhayam",
      "CMBT",
      "Thirumangalam",
      "Puzhuthivakkam"
    ]
  },
  {
    "busNo": "562",
    "start": "Ambattur Estate",
    "destination": "Thandalam",
    "routeStops": "Periyapalayam, Red Hills, Puzhal, Pudur, Ambattur OT",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur Estate",
      "Periyapalayam",
      "Red Hills",
      "Puzhal",
      "Pudur",
      "Ambattur OT",
      "Thandalam"
    ]
  },
  {
    "busNo": "563",
    "start": "Ambattur I.E",
    "destination": "Periyapalayam",
    "routeStops": "Ambattur OT, Avadi, Pattabiram",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi",
      "Pattabiram",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "570A",
    "start": "Ambattur Estate",
    "destination": "Kelambakkam",
    "routeStops": "CMBT, Vadapalani, Ashok Nagar, Guindy, Check post, Velachery, SRP tools, Perungudi,Sholinganallur, Navalur, Padur",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur Estate",
      "CMBT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Check post",
      "Velachery",
      "SRP tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Padur",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "7E",
    "start": "Ambattur I.E",
    "destination": "Broadway",
    "routeStops": "Central R.S, Choolai P.O, Doveton, Purasaiwakkam, Kellys, Kilpauk Gardens, Chinthamani, Thirumangalam, Wavin",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Chennai Central",
      "Choolai P.O",
      "Doveton",
      "Purasaiwakkam",
      "Kellys",
      "Kilpauk Gardens",
      "Chinthamani",
      "Thirumangalam",
      "Wavin",
      "Broadway"
    ]
  },
  {
    "busNo": "7H xt",
    "start": "Ambattur I.E",
    "destination": "Broadway",
    "routeStops": "Central R.S, Vepery, Purasaiwakkam, Kellys, Kilpauk Gardens, Chinthamani, Thirumangalam",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Chennai Central",
      "Vepery",
      "Purasaiwakkam",
      "Kellys",
      "Kilpauk Gardens",
      "Chinthamani",
      "Thirumangalam",
      "Broadway"
    ]
  },
  {
    "busNo": "20E",
    "start": "Ambattur I.E",
    "destination": "Ayyapakkam",
    "routeStops": "",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Ayyapakkam"
    ]
  },
  {
    "busNo": "22A",
    "start": "Ambattur I.E",
    "destination": "Thirunamiyur",
    "routeStops": "Korattur, Lucas, Nathamuni, ICF, Ayanavaram, Kellys, Purasaiwakkam, Egmore, Triplicane,Ka nnagi statue, Santhome, AMS, Adyar",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Korattur",
      "Lucas",
      "Nathamuni",
      "ICF",
      "Ayanavaram",
      "Kellys",
      "Purasaiwakkam",
      "Egmore",
      "Triplicane",
      "Ka nnagi statue",
      "Santhome",
      "AMS",
      "Adyar",
      "Thirunamiyur"
    ]
  },
  {
    "busNo": "34",
    "start": "Ambattur I.E",
    "destination": "Thiruvottiyur",
    "routeStops": "Thirumangalam, Rountana, Chinthamani, Kellys, Purasaiwakkam, Choolai P.O., Regal, V.Nagar, Tondiarpet, Tollgate, Therady",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Thirumangalam",
      "Rountana",
      "Chinthamani",
      "Kellys",
      "Purasaiwakkam",
      "Choolai P.O.",
      "Regal",
      "V.Nagar",
      "Tondiarpet",
      "Tollgate",
      "Therady",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "47C",
    "start": "Ambattur I.E",
    "destination": "Kotturpuram",
    "routeStops": "Saidpet, T. Nagar, Mahalingapuram, Choolaimedu, Roundtana, Thirumangalam, Wavin",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Saidpet",
      "T. Nagar",
      "Mahalingapuram",
      "Choolaimedu",
      "Roundtana",
      "Thirumangalam",
      "Wavin",
      "Kotturpuram"
    ]
  },
  {
    "busNo": "62A",
    "start": "Ambattur I.E",
    "destination": "Red Hills",
    "routeStops": "Pudur",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Pudur",
      "Red Hills"
    ]
  },
  {
    "busNo": "219",
    "start": "Ambattur I.E",
    "destination": "Kelambakkam",
    "routeStops": "Collector Nagar, Thirumangalam, Anna Arch, Choolaimedu, Mahalingapuram, T.Nagar, Saidapet, Madhya Kailash, Tidel Park, Thoraipakkam, Siruseri",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Collector Nagar",
      "Thirumangalam",
      "Anna Arch",
      "Choolaimedu",
      "Mahalingapuram",
      "T.Nagar",
      "Saidapet",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "Siruseri",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "572",
    "start": "Ambattur I.E",
    "destination": "Thiruvallur",
    "routeStops": "Ambattur OT, Avadi, Pattabiram, Thirunindravur, Veppampattu, Sevapet, Kakallur",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Veppampattu",
      "Sevapet",
      "Kakallur",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "572K",
    "start": "Ambattur I.E",
    "destination": "Kilanur",
    "routeStops": "Avadi, Pattabiram, Thirunindravur, Veppampattu, Sevapet",
    "areaSection": "Ambattur IE",
    "stops": [
      "Ambattur I.E",
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Veppampattu",
      "Sevapet",
      "Kilanur"
    ]
  },
  {
    "busNo": "70L",
    "start": "Ambattur Karukku",
    "destination": "CMBT",
    "routeStops": "",
    "areaSection": "Ambattur Karukku",
    "stops": [
      "Ambattur Karukku",
      "CMBT"
    ]
  },
  {
    "busNo": "D41",
    "start": "Ambattur O.T.",
    "destination": "Thiruvanmiyur",
    "routeStops": "Korattur, Lucas,Thirumangalam, Amijikarai, KMC, Chetpet,Sterling road, Gemini,Teynampet,Nandanam, Adyar Gate, Mandaveli, AMS, Adyar",
    "areaSection": "Ambattur OT",
    "stops": [
      "Ambattur O.T.",
      "Korattur",
      "Lucas",
      "Thirumangalam",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "Sterling road",
      "Gemini",
      "Teynampet",
      "Nandanam",
      "Adyar Gate",
      "Mandaveli",
      "AMS",
      "Adyar",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "170K",
    "start": "Ambattur O.T",
    "destination": "Guduvanchery",
    "routeStops": "V.Z00, Tambaram, Pallavaram, Guindy, Udhayam, Vadapalani, CMBT, Anna Nagar, Padi, Ambattur I.E",
    "areaSection": "Ambattur OT",
    "stops": [
      "Ambattur O.T",
      "V.Z00",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Udhayam",
      "Vadapalani",
      "CMBT",
      "Anna Nagar",
      "Padi",
      "Ambattur I.E",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "47D",
    "start": "Ambathur O.T.",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, T. Nagar, Sterling Road, Ambattur I.E",
    "areaSection": "Ambattur OT",
    "stops": [
      "Ambathur O.T.",
      "Adyar",
      "T. Nagar",
      "Sterling Road",
      "Ambattur I.E",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "71",
    "start": "Ambattur OT",
    "destination": "Broadway",
    "routeStops": "Central R.S, Taylors Road, New Avadi road, Nadhamuni, Padi, Ambattur IE",
    "areaSection": "Ambattur OT",
    "stops": [
      "Ambattur OT",
      "Chennai Central",
      "Taylors Road",
      "New Avadi road",
      "Nadhamuni",
      "Padi",
      "Ambattur IE",
      "Broadway"
    ]
  },
  {
    "busNo": "147C",
    "start": "Ambattur O.T.",
    "destination": "T.Nagar",
    "routeStops": "Collector Nagar, Blue Star, Anna Hospital, Loyalla College, Sterling Road, Valluvar Kottam",
    "areaSection": "Ambattur OT",
    "stops": [
      "Ambattur O.T.",
      "Collector Nagar",
      "Blue Star",
      "Anna Hospital",
      "Loyalla College",
      "Sterling Road",
      "Valluvar Kottam",
      "T.Nagar"
    ]
  },
  {
    "busNo": "253",
    "start": "Aminjikarai",
    "destination": "Vellavedu",
    "routeStops": "NSK, Mathuravoyal, Vellapanchavadi, Kumananchavadi, Poonamallee, Thirumazhisai",
    "areaSection": "Aminjikkarai",
    "stops": [
      "Aminjikarai",
      "NSK",
      "Mathuravoyal",
      "Vellapanchavadi",
      "Kumananchavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu"
    ]
  },
  {
    "busNo": "60",
    "start": "Anakaputh ur",
    "destination": "Broadway",
    "routeStops": "Pammal, Pallavaram, Guindy, Little Mount, Saidapet, Teynampet, DMS, TVS, Simpson, Central R.S",
    "areaSection": "Anakaputtur",
    "stops": [
      "Anakaputh ur",
      "Pammal",
      "Pallavaram",
      "Guindy",
      "Little Mount",
      "Saidapet",
      "Teynampet",
      "DMS",
      "TVS",
      "Simpson",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "60C",
    "start": "Anakaputh ur",
    "destination": "Broadway",
    "routeStops": "Pammal, Pallavaram, Guindy, Little Mount, Saidapet, Teynampet, DMS, TVS, Simpson, Central R.S",
    "areaSection": "Anakaputtur",
    "stops": [
      "Anakaputh ur",
      "Pammal",
      "Pallavaram",
      "Guindy",
      "Little Mount",
      "Saidapet",
      "Teynampet",
      "DMS",
      "TVS",
      "Simpson",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "M70 xt",
    "start": "Anna Nagar West",
    "destination": "Thiruvanmiyur",
    "routeStops": "Thirumangalam, CMBT, Vadapalani, Ashok nagar, Guindy, Checkpost, Velacherry, Taramani, SRP tools, Jayanthi",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna Nagar West",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Checkpost",
      "Velacherry",
      "Taramani",
      "SRP tools",
      "Jayanthi",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "15",
    "start": "Anna NagarWest",
    "destination": "Broadway",
    "routeStops": "",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna NagarWest",
      "Broadway"
    ]
  },
  {
    "busNo": "15A",
    "start": "Anna Nagar West",
    "destination": "Broadway",
    "routeStops": "Kilpauk",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna Nagar West",
      "Kilpauk",
      "Broadway"
    ]
  },
  {
    "busNo": "15D",
    "start": "Anna Nagar West",
    "destination": "Broadway",
    "routeStops": "Dasaprakash, Anna Hospital, 14 Shops",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna Nagar West",
      "Dasaprakash",
      "Anna Hospital",
      "14 Shops",
      "Broadway"
    ]
  },
  {
    "busNo": "23M extn",
    "start": "Anna Nagar West",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, Gandhi mandapam, Little mount, Saidapet, T.Nagar, Panagal park, Liberty, Power house, Vadapalani, MMDA Colony, CMBT, Thirumangalam",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna Nagar West",
      "Adyar",
      "Gandhi mandapam",
      "Little mount",
      "Saidapet",
      "T.Nagar",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT",
      "Thirumangalam",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "24A",
    "start": "Anna Nagar West",
    "destination": "V House",
    "routeStops": "Shanthi Colony, K4 Police station, Chinthamani, Aminijikarai, Chetpet, Gemini, Royapetah",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna Nagar West",
      "Shanthi Colony",
      "K4 Police station",
      "Chinthamani",
      "Aminijikarai",
      "Chetpet",
      "Gemini",
      "Royapetah",
      "V House"
    ]
  },
  {
    "busNo": "27C cut",
    "start": "Anna nagar West",
    "destination": "T. Nagar",
    "routeStops": "Panagal park, Bharathinagar, Liberty, Power house, Vadapalani, MMDA Colony, CMBT, Thirumangalam",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna nagar West",
      "Panagal park",
      "Bharathinagar",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT",
      "Thirumangalam",
      "T. Nagar"
    ]
  },
  {
    "busNo": "41C",
    "start": "Anna Nagar West",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar Depot, Adyar, AMS, Mandaveli, Mylapore, Luz, Alwarpet, DMS, Gemini, Sterling Road, Chetpet, KMC, Amijikarai, Rountana, Thirumangalam",
    "areaSection": "Anna Nagar West",
    "stops": [
      "Anna Nagar West",
      "Adyar Depot",
      "Adyar",
      "AMS",
      "Mandaveli",
      "Mylapore",
      "Luz",
      "Alwarpet",
      "DMS",
      "Gemini",
      "Sterling Road",
      "Chetpet",
      "KMC",
      "Amijikarai",
      "Rountana",
      "Thirumangalam",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "2A",
    "start": "Anna Square",
    "destination": "M.K.B Nagar",
    "routeStops": "Vyasarpadi, Basin Bridge, Regal, Elephant gate, Central R.S, P R & sons, Walaja Road, Bells Road",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Vyasarpadi",
      "Basin Bridge",
      "Regal",
      "Elephant gate",
      "Chennai Central",
      "P R & sons",
      "Walaja Road",
      "Bells Road",
      "M.K.B Nagar"
    ]
  },
  {
    "busNo": "2A xt",
    "start": "Anna Square",
    "destination": "Kaviarasu Kannadasan Nagar",
    "routeStops": "M.K.B Nagar",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "M.K.B Nagar",
      "Kaviarasu Kannadasan Nagar"
    ]
  },
  {
    "busNo": "C2",
    "start": "Anna Square",
    "destination": "Anna Square",
    "routeStops": "Secretariat, Parrys, Beach Road, Stanley Hospital, Vallalar Nagar, Regal, Central, Pallavan Road, Wallajah road, Chepauk, Triplicane, Ezhilagam",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Secretariat",
      "Parrys",
      "Beach Road",
      "Stanley Hospital",
      "Vallalar Nagar",
      "Regal",
      "Central",
      "Pallavan Road",
      "Wallajah road",
      "Chepauk",
      "Triplicane",
      "Ezhilagam",
      "Anna Square"
    ]
  },
  {
    "busNo": "12G",
    "start": "Anna Square",
    "destination": "K K Nagar",
    "routeStops": "MGR Nagar, Ashok Pillar, West Mambalam, Alwarpet, Luz",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "MGR Nagar",
      "Ashok Pillar",
      "West Mambalam",
      "Alwarpet",
      "Luz",
      "K K Nagar"
    ]
  },
  {
    "busNo": "25G",
    "start": "Anna Square",
    "destination": "Poonamallee",
    "routeStops": "Kannaki Statue, V.House, Royapettah, Palmgrove, Liberty, Vadapalani, Porur, Iyyapanthangal, Kumananchavadi",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Kannaki Statue",
      "V.House",
      "Royapettah",
      "Palmgrove",
      "Liberty",
      "Vadapalani",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "27E",
    "start": "Anna Square",
    "destination": "Elango nagar officer colony",
    "routeStops": "Collector nagar, Thirumangalam, Rountana, Amijikarai, KMC, Egmore RS, Zimson, Triplicane, Kannaki Statue",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Collector nagar",
      "Thirumangalam",
      "Rountana",
      "Amijikarai",
      "KMC",
      "Chennai Egmore",
      "Zimson",
      "Triplicane",
      "Kannaki Statue",
      "Elango nagar officer colony"
    ]
  },
  {
    "busNo": "27H",
    "start": "Anna Square",
    "destination": "Avadi",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Anna Arch, Thirumangalam, Padi, Ambattur OT",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Anna Arch",
      "Thirumangalam",
      "Padi",
      "Ambattur OT",
      "Avadi"
    ]
  },
  {
    "busNo": "27H xt",
    "start": "Anna Square",
    "destination": "Pattabiram",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Anna Arch, Thirumangalam, Padi, Ambattur OT, Avadi",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Anna Arch",
      "Thirumangalam",
      "Padi",
      "Ambattur OT",
      "Avadi",
      "Pattabiram"
    ]
  },
  {
    "busNo": "27L",
    "start": "Anna Square",
    "destination": "Mogappair West",
    "routeStops": "Triplicane, Ethiraj College, Loyola College, Choolaimedu, Thirumangalam",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "Ethiraj College",
      "Loyola College",
      "Choolaimedu",
      "Thirumangalam",
      "Mogappair West"
    ]
  },
  {
    "busNo": "27R",
    "start": "Anna Square",
    "destination": "Oragadam",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Choolaimedu, Anna Arch, Thirumangalam, Vavin, Ambattur I.E,Ambattur OT",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Choolaimedu",
      "Anna Arch",
      "Thirumangalam",
      "Vavin",
      "Ambattur I.E",
      "Ambattur OT",
      "Oragadam"
    ]
  },
  {
    "busNo": "H27",
    "start": "Anna Square",
    "destination": "Ambattur",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Loyola College, Choolaimedu, Roundtana, Thirumangalam, Vavin,Ambattur I.E",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Loyola College",
      "Choolaimedu",
      "Roundtana",
      "Thirumangalam",
      "Vavin",
      "Ambattur I.E",
      "Ambattur"
    ]
  },
  {
    "busNo": "40A",
    "start": "Anna Square",
    "destination": "Avadi",
    "routeStops": "Triplicane, LIC, Egmore, KMC, Aminjikarai, Chinthamani, Blue Star, Collector Nagar, Ambattur OT",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "LIC",
      "Egmore",
      "KMC",
      "Aminjikarai",
      "Chinthamani",
      "Blue Star",
      "Collector Nagar",
      "Ambattur OT",
      "Avadi"
    ]
  },
  {
    "busNo": "45B",
    "start": "Anna Square",
    "destination": "Guindy",
    "routeStops": "Saidapet, Nandanam, Teynampet, Alwarpet, Luz, Chennai Citi Centre",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Saidapet",
      "Nandanam",
      "Teynampet",
      "Alwarpet",
      "Luz",
      "Chennai Citi Centre",
      "Guindy"
    ]
  },
  {
    "busNo": "45G",
    "start": "Anna square",
    "destination": "Guindy",
    "routeStops": "Marina Beach, Chennai Citi Centre, Mylapore, Mandaveli, Adyar G ate, Nandanam, CIT Nagar, Srinivasa, Mettupalayam, Saidapet West",
    "areaSection": "Anna Square",
    "stops": [
      "Anna square",
      "Marina Beach",
      "Chennai Citi Centre",
      "Mylapore",
      "Mandaveli",
      "Adyar G ate",
      "Nandanam",
      "CIT Nagar",
      "Srinivasa",
      "Mettupalayam",
      "Saidapet West",
      "Guindy"
    ]
  },
  {
    "busNo": "M45B",
    "start": "Anna Square",
    "destination": "Nanganallur",
    "routeStops": "Saidapet, Nandanam, Teynampet, Alwarpet, Luz, Chennai Citi Centre",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Saidapet",
      "Nandanam",
      "Teynampet",
      "Alwarpet",
      "Luz",
      "Chennai Citi Centre",
      "Nanganallur"
    ]
  },
  {
    "busNo": "M45E",
    "start": "Anna Square",
    "destination": "Kilkattalai",
    "routeStops": "Triplicane, Chennai Citi Centre, Luz, Saidapet, Velachery",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "Chennai Citi Centre",
      "Luz",
      "Saidapet",
      "Velachery",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "127B",
    "start": "Anna Square",
    "destination": "Thiruverkadu",
    "routeStops": "Maduravoyal, KoyambeduMarket, Amijikarai, KMC, Chetpet, EgmoreR.S, Chindhatripet, Triplicane",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Maduravoyal",
      "KoyambeduMarket",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "EgmoreR.S",
      "Chindhatripet",
      "Triplicane",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "127H",
    "start": "Anna Square",
    "destination": "Villivakkam",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Anna Arch, Thirumangalam, Nadhamuni",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Anna Arch",
      "Thirumangalam",
      "Nadhamuni",
      "Villivakkam"
    ]
  },
  {
    "busNo": "C2",
    "start": "Anna Square",
    "destination": "Anna Square",
    "routeStops": "Ezhilagam, Triplicane, Chepauk, Wallaja Road, Pallavan Road, Central, Regal, Vallalar Nagar, Royapuram bridge, Beach Road, Parrys, Secretariat",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Ezhilagam",
      "Triplicane",
      "Chepauk",
      "Wallaja Road",
      "Pallavan Road",
      "Central",
      "Regal",
      "Vallalar Nagar",
      "Royapuram bridge",
      "Beach Road",
      "Parrys",
      "Secretariat",
      "Anna Square"
    ]
  },
  {
    "busNo": "C2",
    "start": "Anna Square",
    "destination": "Anna Square",
    "routeStops": "Secretariat, Parrys, Beach Road, Stanley Hospital, Vallalar Nagar, Regal, Central, Pallavan Road, Wallajah road, Chepauk, Triplicane, Ezhilagam",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Secretariat",
      "Parrys",
      "Beach Road",
      "Stanley Hospital",
      "Vallalar Nagar",
      "Regal",
      "Central",
      "Pallavan Road",
      "Wallajah road",
      "Chepauk",
      "Triplicane",
      "Ezhilagam",
      "Anna Square"
    ]
  },
  {
    "busNo": "13A",
    "start": "Anna Square",
    "destination": "T.Nagar",
    "routeStops": "Triplicane, Zambazzar, Express Avenue, Royapettah, Gopalapuram playground, Sapphire, LFC, Vanimahal",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Triplicane",
      "Zambazzar",
      "Express Avenue",
      "Royapettah",
      "Gopalapuram playground",
      "Sapphire",
      "LFC",
      "Vanimahal",
      "T.Nagar"
    ]
  },
  {
    "busNo": "22B",
    "start": "Anna Square",
    "destination": "Korattur",
    "routeStops": "Lucas, Nathamuni, ICF, Ayanavaram, Kellys, Purasaiwakkam, Egmore, Triplicane,Ka nnagi statue",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Lucas",
      "Nathamuni",
      "ICF",
      "Ayanavaram",
      "Kellys",
      "Purasaiwakkam",
      "Egmore",
      "Triplicane",
      "Ka nnagi statue",
      "Korattur"
    ]
  },
  {
    "busNo": "27B",
    "start": "Anna Square",
    "destination": "CMBT",
    "routeStops": "Koyambedu, Arumbakkam, NSK nagar,Amijikarai, KMC, Chetpet, MMC School, Egmore RS, Chindatripet, Zimson, Triplicane, Kannaki Statue",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Koyambedu",
      "Arumbakkam",
      "NSK nagar",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "MMC School",
      "Chennai Egmore",
      "Chindatripet",
      "Zimson",
      "Triplicane",
      "Kannaki Statue",
      "CMBT"
    ]
  },
  {
    "busNo": "29A",
    "start": "Anna Square",
    "destination": "Perambur",
    "routeStops": "Otteri, Devoton, Egmore, Pudhupet, Walaja Road, Bells Road, Triplicane",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Otteri",
      "Devoton",
      "Egmore",
      "Pudhupet",
      "Walaja Road",
      "Bells Road",
      "Triplicane",
      "Perambur"
    ]
  },
  {
    "busNo": "M45A",
    "start": "Anna Square",
    "destination": "Velachery",
    "routeStops": "Saidapet, Nandanam, Adyar Gate",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Saidapet",
      "Nandanam",
      "Adyar Gate",
      "Velachery"
    ]
  },
  {
    "busNo": "242xt",
    "start": "Anna Square",
    "destination": "Red Hills",
    "routeStops": "",
    "areaSection": "Anna Square",
    "stops": [
      "Anna Square",
      "Red Hills"
    ]
  },
  {
    "busNo": "61C",
    "start": "Avadi",
    "destination": "Muthapudupet",
    "routeStops": "HVF Hospital, HVF Main Gate",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "HVF Hospital",
      "HVF Main Gate",
      "Muthapudupet"
    ]
  },
  {
    "busNo": "61K",
    "start": "Avadi",
    "destination": "Kaniyamman Nagar",
    "routeStops": "HVF Hospital, Kovilpadagai, Veerapuram",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "HVF Hospital",
      "Kovilpadagai",
      "Veerapuram",
      "Kaniyamman Nagar"
    ]
  },
  {
    "busNo": "61R",
    "start": "Avadi",
    "destination": "Red Hills",
    "routeStops": "HVF Hospital, Kovilpadagai, Vellanur, Veerapuram, Kadavoor",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "HVF Hospital",
      "Kovilpadagai",
      "Vellanur",
      "Veerapuram",
      "Kadavoor",
      "Red Hills"
    ]
  },
  {
    "busNo": "62",
    "start": "Avadi",
    "destination": "Red Hills",
    "routeStops": "Thirumullaivoyal, Ambathur OT, Pudur, Kallikuppam, Surapedu, Puzhal, Bypass road, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Pudur",
      "Kallikuppam",
      "Surapedu",
      "Puzhal",
      "Bypass road",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills"
    ]
  },
  {
    "busNo": "65",
    "start": "Avadi",
    "destination": "Poonamallee",
    "routeStops": "Govardhanagiri, Mettupalayam, Kaduveti, Karaiyanchavadi",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Govardhanagiri",
      "Mettupalayam",
      "Kaduveti",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "65D",
    "start": "Avadi",
    "destination": "Melkondaiyur",
    "routeStops": "Pattabiram, Thirunindravur",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Melkondaiyur"
    ]
  },
  {
    "busNo": "65G",
    "start": "Avadi",
    "destination": "Meyyur",
    "routeStops": "Pattabiram, Thirunindravur",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Meyyur"
    ]
  },
  {
    "busNo": "65H",
    "start": "Avadi",
    "destination": "Red Hills",
    "routeStops": "Pattabiram, Thirunindravur",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Red Hills"
    ]
  },
  {
    "busNo": "70",
    "start": "Avadi",
    "destination": "Tambaram",
    "routeStops": "Ambattur, Padi, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Chennai Airport, Pallavaram, Chromepet",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Ambattur",
      "Padi",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Chennai Airport",
      "Pallavaram",
      "Chromepet",
      "Tambaram"
    ]
  },
  {
    "busNo": "70A",
    "start": "Avadi",
    "destination": "Vandalur Zoo",
    "routeStops": "Tambaram",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Tambaram",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "70B",
    "start": "Avadi",
    "destination": "Chromepet Lakshmi",
    "routeStops": "Ambattur OT, Collector Nagar, CMBT, Vadapalani, Udhayam, Pallavaram",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Ambattur OT",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Udhayam",
      "Pallavaram",
      "Chromepet Lakshmi"
    ]
  },
  {
    "busNo": "A70",
    "start": "Avadi",
    "destination": "Pallavaram",
    "routeStops": "Ambattur, Padi, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Kathipara, Chennai Airport",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Ambattur",
      "Padi",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Kathipara",
      "Chennai Airport",
      "Pallavaram"
    ]
  },
  {
    "busNo": "266",
    "start": "Avadi",
    "destination": "Tambaram",
    "routeStops": "Govardhanagiri, Kaduveti, Karaiyanchavadi, Kumananchavadi, Mangadu, Kundrathur, Pallavaram",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Govardhanagiri",
      "Kaduveti",
      "Karaiyanchavadi",
      "Kumananchavadi",
      "Mangadu",
      "Kundrathur",
      "Pallavaram",
      "Tambaram"
    ]
  },
  {
    "busNo": "565A",
    "start": "Avadi",
    "destination": "Sunguvarchatiram",
    "routeStops": "Govardhanagiri, Karaiyanchavadi, Poonamallee, Irrunkatturkottai, Sriperumbudur",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Govardhanagiri",
      "Karaiyanchavadi",
      "Poonamallee",
      "Irrunkatturkottai",
      "Sriperumbudur",
      "Sunguvarchatiram"
    ]
  },
  {
    "busNo": "580",
    "start": "Avadi",
    "destination": "Arani",
    "routeStops": "Pattabiram, Thiruninravur, Pakkam, Tamaraipakkam, Vadamadurai, Periyapalayam Koot road",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Pattabiram",
      "Thiruninravur",
      "Pakkam",
      "Tamaraipakkam",
      "Vadamadurai",
      "Periyapalayam Koot road",
      "Arani"
    ]
  },
  {
    "busNo": "580M",
    "start": "Avadi",
    "destination": "Malanthur",
    "routeStops": "Pattabiram, Thiruninravur, Pakkam, Tamaraipakkam, Vengal, Vengal Koot road",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Pattabiram",
      "Thiruninravur",
      "Pakkam",
      "Tamaraipakkam",
      "Vengal",
      "Vengal Koot road",
      "Malanthur"
    ]
  },
  {
    "busNo": "24C",
    "start": "Avadi",
    "destination": "V House",
    "routeStops": "Ambattur OT, Collector Nagar, Blue Star, Chinthamani, Aminijikarai, Chetpet, Gemini, Royapetah",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Ambattur OT",
      "Collector Nagar",
      "Blue Star",
      "Chinthamani",
      "Aminijikarai",
      "Chetpet",
      "Gemini",
      "Royapetah",
      "V House"
    ]
  },
  {
    "busNo": "27H",
    "start": "Avadi",
    "destination": "Anna Square",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Anna Arch, Thirumangalam, Padi, Ambattur OT",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Anna Arch",
      "Thirumangalam",
      "Padi",
      "Ambattur OT",
      "Anna Square"
    ]
  },
  {
    "busNo": "41D",
    "start": "Avadi",
    "destination": "Mandaveli",
    "routeStops": "Ambattur OT, Korattur, Lucas,Thirumangalam, Amijikarai, KMC, Chetpet,Sterling road, Gemini,Teynampet,Nandanam, Adyar Gate",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Ambattur OT",
      "Korattur",
      "Lucas",
      "Thirumangalam",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "Sterling road",
      "Gemini",
      "Teynampet",
      "Nandanam",
      "Adyar Gate",
      "Mandaveli"
    ]
  },
  {
    "busNo": "47D",
    "start": "Avadi",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, T. Nagar, Sterling Road, Ambattur I.E",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Adyar",
      "T. Nagar",
      "Sterling Road",
      "Ambattur I.E",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "A47",
    "start": "Avadi",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, T.Nagar, Pushpa Nagar, Ambattur I.E",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Adyar",
      "T.Nagar",
      "Pushpa Nagar",
      "Ambattur I.E",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "M70A",
    "start": "Avadi",
    "destination": "CMBT",
    "routeStops": "Ambattur O.T, Collector Nagar",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Ambattur O.T",
      "Collector Nagar",
      "CMBT"
    ]
  },
  {
    "busNo": "120",
    "start": "Avadi",
    "destination": "Broadway",
    "routeStops": "Central R.S, Purasaiwakkam, Sayani, ICF, Padi, Ambattur OT",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Chennai Central",
      "Purasaiwakkam",
      "Sayani",
      "ICF",
      "Padi",
      "Ambattur OT",
      "Broadway"
    ]
  },
  {
    "busNo": "A147",
    "start": "Avadi",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, T.Nagar, Pushpa Nagar, Ambattur I.E, Collector Nagar",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Adyar",
      "T.Nagar",
      "Pushpa Nagar",
      "Ambattur I.E",
      "Collector Nagar",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "150",
    "start": "Avadi",
    "destination": "Broadway",
    "routeStops": "Central, Dasaprakash, KMC, Amijikarai, Arumbakkam, Koyambedu, Nerkundram, Maduravoyal, Vanagaram, Velappan chavadi, Thiruverkadu, Govardhangiri, Avadi Market",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Central",
      "Dasaprakash",
      "KMC",
      "Amijikarai",
      "Arumbakkam",
      "Koyambedu",
      "Nerkundram",
      "Maduravoyal",
      "Vanagaram",
      "Velappan chavadi",
      "Thiruverkadu",
      "Govardhangiri",
      "Avadi Market",
      "Broadway"
    ]
  },
  {
    "busNo": "162A",
    "start": "Avadi",
    "destination": "Mathur MMDA",
    "routeStops": "Puzhal",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Puzhal",
      "Mathur MMDA"
    ]
  },
  {
    "busNo": "572A",
    "start": "Avadi",
    "destination": "Thiruvallur",
    "routeStops": "Pattabiram, Thirunindravur, Veppampattu, Sevapet, Kakallur",
    "areaSection": "Avadi",
    "stops": [
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Veppampattu",
      "Sevapet",
      "Kakallur",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "71H",
    "start": "Avadi Kamaraj Nagar",
    "destination": "Broadway",
    "routeStops": "Central R.S, New Avadi road, Nadhamuni, Ambattur IE, Ambattur OT, Avadi",
    "areaSection": "Avadi",
    "stops": [
      "Avadi Kamaraj Nagar",
      "Chennai Central",
      "New Avadi road",
      "Nadhamuni",
      "Ambattur IE",
      "Ambattur OT",
      "Avadi",
      "Broadway"
    ]
  },
  {
    "busNo": "22",
    "start": "Ayanavara",
    "destination": "Anna Square",
    "routeStops": "Egmore, Triplicane,Kannagi statue",
    "areaSection": "Ayanavaram",
    "stops": [
      "Ayanavara",
      "Egmore",
      "Triplicane",
      "Kannagi statue",
      "Anna Square"
    ]
  },
  {
    "busNo": "23C",
    "start": "Ayanavaram",
    "destination": "Besant Nagar/Thiruva nmiyur",
    "routeStops": "Purasaiwakkam, Egmore, LIC, TVS, Saidapet, Adyar",
    "areaSection": "Ayanavaram",
    "stops": [
      "Ayanavaram",
      "Purasaiwakkam",
      "Egmore",
      "LIC",
      "TVS",
      "Saidapet",
      "Adyar",
      "Besant Nagar/Thiruva nmiyur"
    ]
  },
  {
    "busNo": "35",
    "start": "Ayanavaram",
    "destination": "Broadway",
    "routeStops": "Sayani, Kellys, Purasaiwakkam, Choolai P.O, Central R.S",
    "areaSection": "Ayanavaram",
    "stops": [
      "Ayanavaram",
      "Sayani",
      "Kellys",
      "Purasaiwakkam",
      "Choolai P.O",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "70G",
    "start": "Ayanavaram",
    "destination": "Tambaram",
    "routeStops": "Anna Nagar East, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Chennai Airport, Pallavaram, Chromepet",
    "areaSection": "Ayanavaram",
    "stops": [
      "Ayanavaram",
      "Anna Nagar East",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Chennai Airport",
      "Pallavaram",
      "Chromepet",
      "Tambaram"
    ]
  },
  {
    "busNo": "114A",
    "start": "Ayanavaram",
    "destination": "Red Hills",
    "routeStops": "Puzhal, Nethaji Circle(byepass), Retteri, Lucas, ICF",
    "areaSection": "Ayanavaram",
    "stops": [
      "Ayanavaram",
      "Puzhal",
      "Nethaji Circle(byepass)",
      "Retteri",
      "Lucas",
      "ICF",
      "Red Hills"
    ]
  },
  {
    "busNo": "20E",
    "start": "Ayyapakkam",
    "destination": "Ambattur I.E",
    "routeStops": "",
    "areaSection": "Ayyappakkam",
    "stops": [
      "Ayyapakkam",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "20J",
    "start": "Ayyapakkam",
    "destination": "CMBT",
    "routeStops": "",
    "areaSection": "Ayyappakkam",
    "stops": [
      "Ayyapakkam",
      "CMBT"
    ]
  },
  {
    "busNo": "147Cxt",
    "start": "Ayapakkam",
    "destination": "T.Nagar",
    "routeStops": "Ambattur I.E",
    "areaSection": "Ayyappakkam",
    "stops": [
      "Ayapakkam",
      "Ambattur I.E",
      "T.Nagar"
    ]
  },
  {
    "busNo": "23M cut",
    "start": "Besant nagar",
    "destination": "CMBT",
    "routeStops": "Adyar, Gandhi mandapam, Little mount, Saidapet, T.Nagar, Panagal park, Liberty, Power house, Vadapalani, MMDA Colony",
    "areaSection": "Besant Nagar",
    "stops": [
      "Besant nagar",
      "Adyar",
      "Gandhi mandapam",
      "Little mount",
      "Saidapet",
      "T.Nagar",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT"
    ]
  },
  {
    "busNo": "47B",
    "start": "Besant Nagar",
    "destination": "Villivakkam",
    "routeStops": "Avvai Home, Adyar B.S, T.Nagar, Anna Nagar East",
    "areaSection": "Besant Nagar",
    "stops": [
      "Besant Nagar",
      "Avvai Home",
      "Adyar B.S",
      "T.Nagar",
      "Anna Nagar East",
      "Villivakkam"
    ]
  },
  {
    "busNo": "6A",
    "start": "Besant Nagar",
    "destination": "Tollgate",
    "routeStops": "Adyar, Foreshore Estate, Triplicane, Parry's Corner, Maharani, Washermanpet,",
    "areaSection": "Besant Nagar",
    "stops": [
      "Besant Nagar",
      "Adyar",
      "Foreshore Estate",
      "Triplicane",
      "Parry's Corner",
      "Maharani",
      "Washermanpet",
      "Tollgate"
    ]
  },
  {
    "busNo": "23C",
    "start": "Besant Nagar/Thir uvanmiyur",
    "destination": "Ayanavaram",
    "routeStops": "Purasaiwakkam, Egmore, LIC, TVS, Saidapet, Adyar",
    "areaSection": "Besant Nagar",
    "stops": [
      "Besant Nagar/Thir uvanmiyur",
      "Purasaiwakkam",
      "Egmore",
      "LIC",
      "TVS",
      "Saidapet",
      "Adyar",
      "Ayanavaram"
    ]
  },
  {
    "busNo": "29C",
    "start": "Besant Nagar/Thir uvanmiyur",
    "destination": "Perambur",
    "routeStops": "Jamaliya, Otteri, KMC, Chetpet, Sterling Road/College Road, Gemini, Mylapore, Mandaveli, Adyar",
    "areaSection": "Besant Nagar",
    "stops": [
      "Besant Nagar/Thir uvanmiyur",
      "Jamaliya",
      "Otteri",
      "KMC",
      "Chetpet",
      "Sterling Road/College Road",
      "Gemini",
      "Mylapore",
      "Mandaveli",
      "Adyar",
      "Perambur"
    ]
  },
  {
    "busNo": "1G Cut",
    "start": "Broadway",
    "destination": "Madipakkam",
    "routeStops": "Velachery, Saidapet, TVS, LIC, Central",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Velachery",
      "Saidapet",
      "TVS",
      "LIC",
      "Central",
      "Madipakkam"
    ]
  },
  {
    "busNo": "A1 xt",
    "start": "Broadway",
    "destination": "Kovalam",
    "routeStops": "Central, LIC, Royapettah, Luz, Mylapore, Mandaveli, AMS, Adyar, Thiruvanmiyur, Kottivakkam, Palavakkam, Neelangarai, Injambakkam, Uthandi, Kanathur, Muttukadu boat yard",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "LIC",
      "Royapettah",
      "Luz",
      "Mylapore",
      "Mandaveli",
      "AMS",
      "Adyar",
      "Thiruvanmiyur",
      "Kottivakkam",
      "Palavakkam",
      "Neelangarai",
      "Injambakkam",
      "Uthandi",
      "Kanathur",
      "Muttukadu boat yard",
      "Kovalam"
    ]
  },
  {
    "busNo": "5C",
    "start": "Broadway",
    "destination": "Taramani",
    "routeStops": "Madhya Kailash, Kotturpuram, Alwarpet, Royapettah, Chennai Central",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Madhya Kailash",
      "Kotturpuram",
      "Alwarpet",
      "Royapettah",
      "Chennai Central",
      "Taramani"
    ]
  },
  {
    "busNo": "7B",
    "start": "Broadway",
    "destination": "Korattur",
    "routeStops": "Central R.S, Periamet, Vepery, Doveton, Pattalam, Otteri, Ayanavaram, Joint Office, ICF, Villivakkam, Nathamuni",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Periamet",
      "Vepery",
      "Doveton",
      "Pattalam",
      "Otteri",
      "Ayanavaram",
      "Joint Office",
      "ICF",
      "Villivakkam",
      "Nathamuni",
      "Korattur"
    ]
  },
  {
    "busNo": "7E",
    "start": "Broadway",
    "destination": "Ambattur I.E",
    "routeStops": "Central R.S, Choolai P.O, Doveton, Purasaiwakkam, Kellys, Kilpauk Gardens, Chinthamani,",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Choolai P.O",
      "Doveton",
      "Purasaiwakkam",
      "Kellys",
      "Kilpauk Gardens",
      "Chinthamani",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "7F",
    "start": "Broadway",
    "destination": "Anna Nagar West",
    "routeStops": "Central R.S, Vepery, Purasaiwakkam, Kellys, Kilpauk Gardens, Chinthamani, Thirumangalam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Vepery",
      "Purasaiwakkam",
      "Kellys",
      "Kilpauk Gardens",
      "Chinthamani",
      "Thirumangalam",
      "Anna Nagar West"
    ]
  },
  {
    "busNo": "7G",
    "start": "Broadway",
    "destination": "Kaviarasu Kannadasan Nagar",
    "routeStops": "Moolakadai, Perambur market, Pattalam, Doveton, Periamedu, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Moolakadai",
      "Perambur market",
      "Pattalam",
      "Doveton",
      "Periamedu",
      "Chennai Central",
      "Kaviarasu Kannadasan Nagar"
    ]
  },
  {
    "busNo": "7H",
    "start": "Broadway",
    "destination": "Mogappair East",
    "routeStops": "Central R.S, Vepery, Purasaiwakkam, Kellys, Kilpauk Gardens, Chinthamani, Thirumangalam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Vepery",
      "Purasaiwakkam",
      "Kellys",
      "Kilpauk Gardens",
      "Chinthamani",
      "Thirumangalam",
      "Mogappair East"
    ]
  },
  {
    "busNo": "7H xt",
    "start": "Broadway",
    "destination": "Ambattur I.E",
    "routeStops": "Central R.S, Vepery, Purasaiwakkam, Kellys, Kilpauk Gardens, Chinthamani, Thirumangalam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Vepery",
      "Purasaiwakkam",
      "Kellys",
      "Kilpauk Gardens",
      "Chinthamani",
      "Thirumangalam",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "7M",
    "start": "Broadway",
    "destination": "Mogappair West",
    "routeStops": "Central R.S, Vepery, Purasaiwakkam, Kellys, Kilpauk Gardens, Chinthamani, Thirumangalam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Vepery",
      "Purasaiwakkam",
      "Kellys",
      "Kilpauk Gardens",
      "Chinthamani",
      "Thirumangalam",
      "Mogappair West"
    ]
  },
  {
    "busNo": "11",
    "start": "Broadway",
    "destination": "T.Nagar",
    "routeStops": "Panagal park, Vani mahal, Thousand Lights, TVS, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Panagal park",
      "Vani mahal",
      "Thousand Lights",
      "TVS",
      "Chennai Central",
      "T.Nagar"
    ]
  },
  {
    "busNo": "A11",
    "start": "Broadway",
    "destination": "T.Nagar",
    "routeStops": "Teynampet",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Teynampet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "15",
    "start": "Broadway",
    "destination": "Anna NagarWest",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Anna NagarWest"
    ]
  },
  {
    "busNo": "15A",
    "start": "Broadway",
    "destination": "Anna Nagar West",
    "routeStops": "Kilpauk",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Kilpauk",
      "Anna Nagar West"
    ]
  },
  {
    "busNo": "15B",
    "start": "Broadway",
    "destination": "CMBT",
    "routeStops": "Amijikarai, KMC, Dasaprakash, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Amijikarai",
      "KMC",
      "Dasaprakash",
      "Chennai Central",
      "CMBT"
    ]
  },
  {
    "busNo": "15D",
    "start": "Broadway",
    "destination": "Anna Nagar West",
    "routeStops": "Dasaprakash, Anna Hospital, 14 Shops",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Dasaprakash",
      "Anna Hospital",
      "14 Shops",
      "Anna Nagar West"
    ]
  },
  {
    "busNo": "15F",
    "start": "Broadway",
    "destination": "Vadapalani",
    "routeStops": "Virugambakkam, Chinmaya nagar, Koyambedu Market, CMBT, Amijikarai, KMC, Dasaprakash, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Virugambakkam",
      "Chinmaya nagar",
      "Koyambedu Market",
      "CMBT",
      "Amijikarai",
      "KMC",
      "Dasaprakash",
      "Chennai Central",
      "Vadapalani"
    ]
  },
  {
    "busNo": "15F cut",
    "start": "Broadway",
    "destination": "Koyambedu Ma rket",
    "routeStops": "CMBT, Amijikarai, KMC, Dasaprakash, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "CMBT",
      "Amijikarai",
      "KMC",
      "Dasaprakash",
      "Chennai Central",
      "Koyambedu Ma rket"
    ]
  },
  {
    "busNo": "15L",
    "start": "Broadway",
    "destination": "Athipet ICF colony",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Athipet ICF colony"
    ]
  },
  {
    "busNo": "17",
    "start": "Broadway",
    "destination": "Vadapalani",
    "routeStops": "Central,Chindatripet,Egmore RS, Chetpet,Sterling road, Loyola college, Kodambakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "Chindatripet",
      "Chennai Egmore",
      "Chetpet",
      "Sterling road",
      "Loyola college",
      "Kodambakkam",
      "Vadapalani"
    ]
  },
  {
    "busNo": "17A",
    "start": "Broadway",
    "destination": "CMBT",
    "routeStops": "Koyambedu Market, Virugambakkam, Vadapalani, Gemini",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Koyambedu Market",
      "Virugambakkam",
      "Vadapalani",
      "Gemini",
      "CMBT"
    ]
  },
  {
    "busNo": "17B",
    "start": "Broadway",
    "destination": "Mangadu",
    "routeStops": "Paranipathur, Baikadai, Moulivakkam, Porur, Virugambakkam, Vadapalani, Gemini, Thousand lights, Central",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Paranipathur",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Virugambakkam",
      "Vadapalani",
      "Gemini",
      "Thousand lights",
      "Central",
      "Mangadu"
    ]
  },
  {
    "busNo": "17C",
    "start": "Broadway",
    "destination": "Iyyapanthangal",
    "routeStops": "Central, Egmore, DPI, Sterling Road, Valluvarkottam, Liberty, Vadapalani, Virugambakkam, Valasarawakkam, Porur, SRMC",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Virugambakkam",
      "Valasarawakkam",
      "Porur",
      "SRMC",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "17D",
    "start": "Broadway",
    "destination": "K K Nagar",
    "routeStops": "Central, Egmore, DPI, Sterling Road, Valluvarkottam, Liberty, Udhayam, Nesapakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Udhayam",
      "Nesapakkam",
      "K K Nagar"
    ]
  },
  {
    "busNo": "17E",
    "start": "Broadway",
    "destination": "Saligramam",
    "routeStops": "Central, Chindatripet, Egmore, DPI, Sterling Road, Valluvarkottam, Liberty, Vadapalani",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "Chindatripet",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Saligramam"
    ]
  },
  {
    "busNo": "17G",
    "start": "Broadway",
    "destination": "Mogalivakkam",
    "routeStops": "Kedar Hospital, Ramapuram, Angalamman Koil, Alwarthirunagar, Virugambakkam, Vadapalani, Gemini, Thousand lights, Central",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Kedar Hospital",
      "Ramapuram",
      "Angalamman Koil",
      "Alwarthirunagar",
      "Virugambakkam",
      "Vadapalani",
      "Gemini",
      "Thousand lights",
      "Central",
      "Mogalivakkam"
    ]
  },
  {
    "busNo": "17K",
    "start": "Broadway",
    "destination": "Dasarathapuram",
    "routeStops": "Central, Egmore, DPI, Sterling Road, Valluvarkottam, Liberty, Vadapalani",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Dasarathapuram"
    ]
  },
  {
    "busNo": "17M",
    "start": "Broadway",
    "destination": "Iyyapanthangal",
    "routeStops": "Porur, Virugambakkam, Vadapalani, Kodambakkam Power house, Liberty, Periyar Road, Valluvar kottam, Gemini, Thousand lights, TVS, LIC, Simpson, Central",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Porur",
      "Virugambakkam",
      "Vadapalani",
      "Kodambakkam Power house",
      "Liberty",
      "Periyar Road",
      "Valluvar kottam",
      "Gemini",
      "Thousand lights",
      "TVS",
      "LIC",
      "Simpson",
      "Central",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "18",
    "start": "Broadway",
    "destination": "Guindy",
    "routeStops": "Central R.S, Zimson, Shanthi Theater, LIC, TVS, Thousand Lights, DMS, Vanavil, SIET, Defence Accounts office, Nandanam, Saidapet",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Zimson",
      "Shanthi Theater",
      "LIC",
      "TVS",
      "Thousand Lights",
      "DMS",
      "Vanavil",
      "SIET",
      "Defence Accounts office",
      "Nandanam",
      "Saidapet",
      "Guindy"
    ]
  },
  {
    "busNo": "18A",
    "start": "Broadway",
    "destination": "Perugalathur",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Chr omepet, Tambaram Sanatorium, Tambaram",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Chr omepet",
      "Tambaram Sanatorium",
      "Tambaram",
      "Perugalathur"
    ]
  },
  {
    "busNo": "18D",
    "start": "Broadway",
    "destination": "Kilkattalai",
    "routeStops": "LIC, TVS, Saidapet, Guindy, St. Thomas Mount",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "St. Thomas Mount",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "18E",
    "start": "Broadway",
    "destination": "Ramapuram",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Nandambakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Nandambakkam",
      "Ramapuram"
    ]
  },
  {
    "busNo": "18F",
    "start": "Broadway",
    "destination": "Guindy",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Nandanam, CIT Nagar, Srinivasa, Mettupalayam, Saidapet West",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Nandanam",
      "CIT Nagar",
      "Srinivasa",
      "Mettupalayam",
      "Saidapet West",
      "Guindy"
    ]
  },
  {
    "busNo": "18K",
    "start": "Broadway",
    "destination": "Saidapet West",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Teynampet, Nandanam, CIT Nagar, Srinivasa, Mettupalayam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Teynampet",
      "Nandanam",
      "CIT Nagar",
      "Srinivasa",
      "Mettupalayam",
      "Saidapet West"
    ]
  },
  {
    "busNo": "K18",
    "start": "Broadway",
    "destination": "Saidapet West",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Teynampet, Nandanam, Saidapet, Guindy, Ekkaduthangal,Ashok nagar, Mettupalayam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Teynampet",
      "Nandanam",
      "Saidapet",
      "Guindy",
      "Ekkaduthangal",
      "Ashok nagar",
      "Mettupalayam",
      "Saidapet West"
    ]
  },
  {
    "busNo": "K18 cut",
    "start": "Broadway",
    "destination": "Ekkaduthangal",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Teynampet, Nandanam, Saidapet, Guindy,CIPET",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Teynampet",
      "Nandanam",
      "Saidapet",
      "Guindy",
      "CIPET",
      "Ekkaduthangal"
    ]
  },
  {
    "busNo": "19G",
    "start": "Broadway",
    "destination": "Kovalam",
    "routeStops": "Central, LIC, DMS, SIET, Saidapet, Anna university, Adyar, Thiruvanmiyur, Kottivakkam, Palavakkam, Neelangarai, Injambakkam, Uthandi, Kanathur, Muttukadu boat yard",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "LIC",
      "DMS",
      "SIET",
      "Saidapet",
      "Anna university",
      "Adyar",
      "Thiruvanmiyur",
      "Kottivakkam",
      "Palavakkam",
      "Neelangarai",
      "Injambakkam",
      "Uthandi",
      "Kanathur",
      "Muttukadu boat yard",
      "Kovalam"
    ]
  },
  {
    "busNo": "PP19xt",
    "start": "Broadway",
    "destination": "Kovalam",
    "routeStops": "Marina Beach, Thiruvanmiyur, Injambakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Marina Beach",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam"
    ]
  },
  {
    "busNo": "20",
    "start": "Broadway",
    "destination": "Villivakkam",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Villivakkam"
    ]
  },
  {
    "busNo": "20A",
    "start": "Broadway",
    "destination": "Mugappair West",
    "routeStops": "Central RS, Periyamedu, Purasaiwakkam, Villivakkam, Nadhamuni, Ambattur I.E",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Periyamedu",
      "Purasaiwakkam",
      "Villivakkam",
      "Nadhamuni",
      "Ambattur I.E",
      "Mugappair West"
    ]
  },
  {
    "busNo": "20B",
    "start": "Broadway",
    "destination": "Menambedu",
    "routeStops": "Purasaiwakkam, Villivakkam, Nadhamuni, Padi, Ambattur I.E, Dunlop, Ambattur OT",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Purasaiwakkam",
      "Villivakkam",
      "Nadhamuni",
      "Padi",
      "Ambattur I.E",
      "Dunlop",
      "Ambattur OT",
      "Menambedu"
    ]
  },
  {
    "busNo": "20C",
    "start": "Broadway",
    "destination": "Oragadam",
    "routeStops": "Purasaiwakkam, Villivakkam, Nadhamuni, Padi, Ambattur I.E, Dunlop, Ambattur OT",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Purasaiwakkam",
      "Villivakkam",
      "Nadhamuni",
      "Padi",
      "Ambattur I.E",
      "Dunlop",
      "Ambattur OT",
      "Oragadam"
    ]
  },
  {
    "busNo": "20M",
    "start": "Broadway",
    "destination": "Kumaran Nagar",
    "routeStops": "Villivakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Villivakkam",
      "Kumaran Nagar"
    ]
  },
  {
    "busNo": "20N",
    "start": "Broadway",
    "destination": "Poombukar",
    "routeStops": "Villivakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Villivakkam",
      "Poombukar"
    ]
  },
  {
    "busNo": "21",
    "start": "Broadway",
    "destination": "Mandaveli",
    "routeStops": "Mylapore, Luz, Ajanta, Express Avenue, L.I.C, Simpson, Central",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Mylapore",
      "Luz",
      "Ajanta",
      "Express Avenue",
      "L.I.C",
      "Simpson",
      "Central",
      "Mandaveli"
    ]
  },
  {
    "busNo": "21D",
    "start": "Broadway",
    "destination": "Thiruvanmiyur",
    "routeStops": "Indira Nagar, Besant Nagar, Foreshore Estate, Anna Square",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Indira Nagar",
      "Besant Nagar",
      "Foreshore Estate",
      "Anna Square",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "21E",
    "start": "Broadway",
    "destination": "Iyyapanthangal",
    "routeStops": "Porur, Guindy, Adayar, Foreshore Estate, Anna Square",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Porur",
      "Guindy",
      "Adayar",
      "Foreshore Estate",
      "Anna Square",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "21G",
    "start": "Broadway",
    "destination": "Tambaram",
    "routeStops": "Anna Square, Mylapore, Mandaveli, Adyar Gate, Guindy",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Anna Square",
      "Mylapore",
      "Mandaveli",
      "Adyar Gate",
      "Guindy",
      "Tambaram"
    ]
  },
  {
    "busNo": "21H",
    "start": "Broadway",
    "destination": "Kelambakkam",
    "routeStops": "Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Perungudi, Sholinganallur, Navalur",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "21K",
    "start": "Broadway",
    "destination": "Bharath Electronics",
    "routeStops": "Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, Anna University,Guindy, Butt Road, Defence Colony",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "Anna University",
      "Guindy",
      "Butt Road",
      "Defence Colony",
      "Bharath Electronics"
    ]
  },
  {
    "busNo": "21L xt",
    "start": "Broadway",
    "destination": "Kilkattalai",
    "routeStops": "Marina Beach, Foreshore Estate, MRC Nagar, Adyar, Anna University, Velachery",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Marina Beach",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "Anna University",
      "Velachery",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "C21",
    "start": "Broadway",
    "destination": "Ottiyambakkam",
    "routeStops": "Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Perungudi, Sholinganallur, Perumbakkam, Nukkanpalayam, Arasan Kazhani",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Perumbakkam",
      "Nukkanpalayam",
      "Arasan Kazhani",
      "Ottiyambakkam"
    ]
  },
  {
    "busNo": "G21",
    "start": "Broadway",
    "destination": "Chromepet",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Sanskrit College, Luz, Mylapore, Mandaveli BS, Adyar Gate, Kotturpuram, Anna university, Guindy, Pallavaram",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Sanskrit College",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "Adyar Gate",
      "Kotturpuram",
      "Anna university",
      "Guindy",
      "Pallavaram",
      "Chromepet"
    ]
  },
  {
    "busNo": "H21",
    "start": "Broadway",
    "destination": "Chemmenchery",
    "routeStops": "Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Perungudi, Sholinganallur",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Chemmenchery"
    ]
  },
  {
    "busNo": "L21",
    "start": "Broadway",
    "destination": "Velachery",
    "routeStops": "Marina Beach, Foreshore Estate, MRC Nagar, Adyar, SRP Tools",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Marina Beach",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Velachery"
    ]
  },
  {
    "busNo": "R21",
    "start": "Broadway",
    "destination": "Pallavaram",
    "routeStops": "Eachangadu, Kilkattalai, Velachery, SRP, Adayar, Foreshore Estate, Anna Square",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Eachangadu",
      "Kilkattalai",
      "Velachery",
      "SRP",
      "Adayar",
      "Foreshore Estate",
      "Anna Square",
      "Pallavaram"
    ]
  },
  {
    "busNo": "S21",
    "start": "Broadway",
    "destination": "Mettukuppam",
    "routeStops": ", Adyar",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Adyar",
      "Mettukuppam"
    ]
  },
  {
    "busNo": "T21",
    "start": "Broadway",
    "destination": "Kannagi Nagar",
    "routeStops": "Thoraipakkam, Adyar, Marina",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Thoraipakkam",
      "Adyar",
      "Marina",
      "Kannagi Nagar"
    ]
  },
  {
    "busNo": "M21G",
    "start": "Broadway",
    "destination": "Guindy",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Sanskrit College, Luz, Mylapore, Mandaveli BS, Adyar Gate, Kotturpuram, Anna university,",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Sanskrit College",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "Adyar Gate",
      "Kotturpuram",
      "Anna university",
      "Guindy"
    ]
  },
  {
    "busNo": "M21G xt",
    "start": "Broadway",
    "destination": "Ekkaduthangal",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Sanskrit College, Luz, Mylapore, Mandaveli BS, Adyar Gate, Kotturpuram, Anna university, Guindy",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Sanskrit College",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "Adyar Gate",
      "Kotturpuram",
      "Anna university",
      "Guindy",
      "Ekkaduthangal"
    ]
  },
  {
    "busNo": "PP21",
    "start": "Broadway",
    "destination": "Guduvanchery",
    "routeStops": "Secretariat, Chepauk, Q.M.C, Fore Shore Estate, Adyar Bus Stand, Guindy,Pallavaram, Chromepet, Tambaram, Vandalur Zoo",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretariat",
      "Chepauk",
      "Q.M.C",
      "Fore Shore Estate",
      "Adyar Bus Stand",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "33",
    "start": "Broadway",
    "destination": "M.K.B Nagar",
    "routeStops": "Vyasarpadi, Basin Bridge, Mint, Mannadi",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Mannadi",
      "M.K.B Nagar"
    ]
  },
  {
    "busNo": "M33xt",
    "start": "Broadway",
    "destination": "Kaviarasu Kannadasan Nagar",
    "routeStops": "M.K.B Nagar, Vyasarpadi, Basin Bridge, Mint, Mannadi",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "M.K.B Nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Mannadi",
      "Kaviarasu Kannadasan Nagar"
    ]
  },
  {
    "busNo": "M33A",
    "start": "Broadway",
    "destination": "Moolakadai",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Moolakadai"
    ]
  },
  {
    "busNo": "42",
    "start": "Broadway",
    "destination": "Periyar Nagar",
    "routeStops": "Central R.S, Periamet, Natarajatheatre, Pulianthope, Pattalam, Kannigapuram, Perambur B.S, Venus, Peravallur",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Periamet",
      "Natarajatheatre",
      "Pulianthope",
      "Pattalam",
      "Kannigapuram",
      "Perambur B.S",
      "Venus",
      "Peravallur",
      "Periyar Nagar"
    ]
  },
  {
    "busNo": "42A",
    "start": "Broadway",
    "destination": "G.K.M colony",
    "routeStops": "Central R.S, Periamet, Nataraja theatre, Pulianthope, Pattalam, Kannigapuram, Perambur B.S, Venus, Peravallur",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Periamet",
      "Nataraja theatre",
      "Pulianthope",
      "Pattalam",
      "Kannigapuram",
      "Perambur B.S",
      "Venus",
      "Peravallur",
      "G.K.M colony"
    ]
  },
  {
    "busNo": "M42B",
    "start": "Broadway",
    "destination": "Poombuhar",
    "routeStops": "Central R.S, Periamet, Choolaipostoffice, Doveton, Bhuvaneswari, Pattalam, Otteri, Perambur, Venus, Peravallur,Nehrusilai",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Periamet",
      "Choolaipostoffice",
      "Doveton",
      "Bhuvaneswari",
      "Pattalam",
      "Otteri",
      "Perambur",
      "Venus",
      "Peravallur",
      "Nehrusilai",
      "Poombuhar"
    ]
  },
  {
    "busNo": "M42C",
    "start": "Broadway",
    "destination": "Teacherscolony",
    "routeStops": "Central, Periamet, Natarajatheatre, Pulianthope, Pattalam, Kannigapuram, Perambur B.S, Venus, Peravallur, Kolathur, Vinayagapuram",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "Periamet",
      "Natarajatheatre",
      "Pulianthope",
      "Pattalam",
      "Kannigapuram",
      "Perambur B.S",
      "Venus",
      "Peravallur",
      "Kolathur",
      "Vinayagapuram",
      "Teacherscolony"
    ]
  },
  {
    "busNo": "M42D",
    "start": "Broadway",
    "destination": "Srinivasanagar",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Srinivasanagar"
    ]
  },
  {
    "busNo": "44A",
    "start": "Broadway",
    "destination": "I.O.C (Indian Oil Corporation)",
    "routeStops": "Tondiarpet",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Tondiarpet",
      "I.O.C (Indian Oil Corporation)"
    ]
  },
  {
    "busNo": "44C",
    "start": "Broadway",
    "destination": "I.O.C",
    "routeStops": "Korukkupet",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Korukkupet",
      "I.O.C"
    ]
  },
  {
    "busNo": "44D",
    "start": "Broadway",
    "destination": "I.O.C",
    "routeStops": "Sathiyamoorthy Nagar",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Sathiyamoorthy Nagar",
      "I.O.C"
    ]
  },
  {
    "busNo": "44L",
    "start": "Broadway",
    "destination": "Parvathi Nagar (Kodungaiyur)",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Parvathi Nagar (Kodungaiyur)"
    ]
  },
  {
    "busNo": "50",
    "start": "Broadway",
    "destination": "Thiruverkadu",
    "routeStops": "Central, Dasaprakash, KMC, Amijikarai, Arumbakkam, Koyambedu, Nerkundram, Maduravoyal, Vanagaram, Velappan chavadi",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "Dasaprakash",
      "KMC",
      "Amijikarai",
      "Arumbakkam",
      "Koyambedu",
      "Nerkundram",
      "Maduravoyal",
      "Vanagaram",
      "Velappan chavadi",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "51J",
    "start": "Broadway",
    "destination": "Ponmar",
    "routeStops": "Central, LIC, DMS, SIET, Saidapet, CheckpostVelachery,Medavakkam,Sith alapakkam koot road,Kovilancherry,Madurapakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Central",
      "LIC",
      "DMS",
      "SIET",
      "Saidapet",
      "CheckpostVelachery",
      "Medavakkam",
      "Sith alapakkam koot road",
      "Kovilancherry",
      "Madurapakkam",
      "Ponmar"
    ]
  },
  {
    "busNo": "51R",
    "start": "Broadway",
    "destination": "Madipakkam BS",
    "routeStops": "Puzhudivakkam, Guindy Race Course",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Puzhudivakkam",
      "Guindy Race Course",
      "Madipakkam BS"
    ]
  },
  {
    "busNo": "53",
    "start": "Broadway",
    "destination": "Poonamallee",
    "routeStops": "Kumananchavadi, Mathruvayoil, Arumbakkam, Aminijikarai, KMC, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Kumananchavadi",
      "Mathruvayoil",
      "Arumbakkam",
      "Aminijikarai",
      "KMC",
      "Chennai Central",
      "Poonamallee"
    ]
  },
  {
    "busNo": "53E",
    "start": "Broadway",
    "destination": "Mangadu",
    "routeStops": "Kumananchavadi, Mathruvayoil, Arumbakkam, Aminijikarai, KMC, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Kumananchavadi",
      "Mathruvayoil",
      "Arumbakkam",
      "Aminijikarai",
      "KMC",
      "Chennai Central",
      "Mangadu"
    ]
  },
  {
    "busNo": "54K",
    "start": "Broadway",
    "destination": "Nemam",
    "routeStops": "Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet, DMS, TVS, LIC, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Nemam"
    ]
  },
  {
    "busNo": "56",
    "start": "Broadway",
    "destination": "Kargil Nagar",
    "routeStops": "V.Nagar, Tondiarpet, Thiruvottriyur, Sathyamoorthy nagar",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "V.Nagar",
      "Tondiarpet",
      "Thiruvottriyur",
      "Sathyamoorthy nagar",
      "Kargil Nagar"
    ]
  },
  {
    "busNo": "56 xt",
    "start": "Broadway",
    "destination": "Ennore",
    "routeStops": "V.Nagar, Tondiarpet, Thiruvottriyur, Ernavoor, Ashok Leyland",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "V.Nagar",
      "Tondiarpet",
      "Thiruvottriyur",
      "Ernavoor",
      "Ashok Leyland",
      "Ennore"
    ]
  },
  {
    "busNo": "56D",
    "start": "Broadway",
    "destination": "Manali",
    "routeStops": "Beach R.S, Thambuchetty St., Kalmandappam, Kasimedu, Tondirapet, Tollgate, Rajakadai, Thiruvotriyur R.S, Mattumandai",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Beach",
      "Thambuchetty St.",
      "Kalmandappam",
      "Kasimedu",
      "Tondirapet",
      "Tollgate",
      "Rajakadai",
      "Thiruvotriyur R.S",
      "Mattumandai",
      "Manali"
    ]
  },
  {
    "busNo": "56N",
    "start": "Broadway",
    "destination": "Ennore",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Ennore"
    ]
  },
  {
    "busNo": "58A",
    "start": "Broadway",
    "destination": "Red Hills",
    "routeStops": "V.Nagar, Vyasarpadi, Moolakadai, Mathur",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "V.Nagar",
      "Vyasarpadi",
      "Moolakadai",
      "Mathur",
      "Red Hills"
    ]
  },
  {
    "busNo": "58H",
    "start": "Broadway",
    "destination": "New Erumai Vettipalayam",
    "routeStops": "Karanodai, RedHills, V.Nagar, Vyasarpadi, Moolakadai",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Karanodai",
      "RedHills",
      "V.Nagar",
      "Vyasarpadi",
      "Moolakadai",
      "New Erumai Vettipalayam"
    ]
  },
  {
    "busNo": "58G",
    "start": "Broadway",
    "destination": "Gnayaru",
    "routeStops": "V.Nagar, Vyasarpadi, Moolakadai",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "V.Nagar",
      "Vyasarpadi",
      "Moolakadai",
      "Gnayaru"
    ]
  },
  {
    "busNo": "60D",
    "start": "Broadway",
    "destination": "Kamarajpuram, Anakaputhur",
    "routeStops": "Pallavaram, Guindy",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Pallavaram",
      "Guindy",
      "Kamarajpuram, Anakaputhur"
    ]
  },
  {
    "busNo": "60E",
    "start": "Broadway",
    "destination": "Kundrathur",
    "routeStops": "Andankuppam, Anakaputtur, Pallavaram, Guindy, Anna University, Adyar, Sathyastudio, MRC Nagar, Pattinapakkam, AIR, Kannagi Statue, Annasquare",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Andankuppam",
      "Anakaputtur",
      "Pallavaram",
      "Guindy",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "MRC Nagar",
      "Pattinapakkam",
      "AIR",
      "Kannagi Statue",
      "Annasquare",
      "Kundrathur"
    ]
  },
  {
    "busNo": "60G",
    "start": "Broadway",
    "destination": "Pozhichalur",
    "routeStops": "Pallavaram, Guindy, Anna University, Adyar, Sathyastudio, MRC Nagar, Pattinapakkam, AIR, Kannagi Statue, Annasquare",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Pallavaram",
      "Guindy",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "MRC Nagar",
      "Pattinapakkam",
      "AIR",
      "Kannagi Statue",
      "Annasquare",
      "Pozhichalur"
    ]
  },
  {
    "busNo": "60H",
    "start": "Broadway",
    "destination": "Shankar Nagar, Pammal",
    "routeStops": "Pammal, Pallavaram, Guindy",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Pammal",
      "Pallavaram",
      "Guindy",
      "Shankar Nagar, Pammal"
    ]
  },
  {
    "busNo": "61D",
    "start": "Broadway",
    "destination": "Kadavoor",
    "routeStops": "Central R.S, Purasaiwakkam, Ayanavaram, Nadhamuni, Padi, Amabattur IE, Avadi, HVF Hospital, Kovilpadagai, Veerapuram",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Purasaiwakkam",
      "Ayanavaram",
      "Nadhamuni",
      "Padi",
      "Amabattur IE",
      "Avadi",
      "HVF Hospital",
      "Kovilpadagai",
      "Veerapuram",
      "Kadavoor"
    ]
  },
  {
    "busNo": "61D xt",
    "start": "Broadway",
    "destination": "Kilkondaiyar",
    "routeStops": "Avadi, Kadavoor",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Avadi",
      "Kadavoor",
      "Kilkondaiyar"
    ]
  },
  {
    "busNo": "61E",
    "start": "Broadway",
    "destination": "Kilkondaiyar",
    "routeStops": "Ambattur IE, Avadi, HVF Hospital, Kovilpadagai, Vellanur, Veerapuram, Arakkambakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Ambattur IE",
      "Avadi",
      "HVF Hospital",
      "Kovilpadagai",
      "Vellanur",
      "Veerapuram",
      "Arakkambakkam",
      "Kilkondaiyar"
    ]
  },
  {
    "busNo": "M64B",
    "start": "Broadway",
    "destination": "Minjur",
    "routeStops": "Napalayam, Manali New Town, MFL, CPCL, Manali, Madhavaram Milk colony, Moolakadai, Perambur market, Pulianthope, Doveton, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Napalayam",
      "Manali New Town",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk colony",
      "Moolakadai",
      "Perambur market",
      "Pulianthope",
      "Doveton",
      "Chennai Central",
      "Minjur"
    ]
  },
  {
    "busNo": "M64D",
    "start": "Broadway",
    "destination": "Kosappur",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, Vyasarpadi, Pulianthope, Doveton, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "Vyasarpadi",
      "Pulianthope",
      "Doveton",
      "Chennai Central",
      "Kosappur"
    ]
  },
  {
    "busNo": "71",
    "start": "Broadway",
    "destination": "Ambattur OT",
    "routeStops": "Central R.S, Taylors Road, New Avadi road, Nadhamuni, Padi, Ambattur IE",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Taylors Road",
      "New Avadi road",
      "Nadhamuni",
      "Padi",
      "Ambattur IE",
      "Ambattur OT"
    ]
  },
  {
    "busNo": "71D",
    "start": "Broadway",
    "destination": "Pudur",
    "routeStops": "Central R.S, Nadhamuni, Padi, Ambattur IE, Ambattur OT",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Nadhamuni",
      "Padi",
      "Ambattur IE",
      "Ambattur OT",
      "Pudur"
    ]
  },
  {
    "busNo": "71F",
    "start": "Broadway",
    "destination": "Senthil Nagar",
    "routeStops": "Central R.S, Nadhamuni, Ambattur IE, Ambattur OT",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Nadhamuni",
      "Ambattur IE",
      "Ambattur OT",
      "Senthil Nagar"
    ]
  },
  {
    "busNo": "71H",
    "start": "Broadway",
    "destination": "Avadi Kamaraj Nagar",
    "routeStops": "Central R.S, New Avadi road, Nadhamuni, Ambattur IE, Ambattur OT, Avadi",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "New Avadi road",
      "Nadhamuni",
      "Ambattur IE",
      "Ambattur OT",
      "Avadi",
      "Avadi Kamaraj Nagar"
    ]
  },
  {
    "busNo": "71V",
    "start": "Broadway",
    "destination": "Veppampattu",
    "routeStops": "Central R.S, Nadhamuni, Ambattur I.E, Ambattur OT, Avadi, Thirunindravur",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Nadhamuni",
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi",
      "Thirunindravur",
      "Veppampattu"
    ]
  },
  {
    "busNo": "M116",
    "start": "Broadway",
    "destination": "Kaviarasu Kannadhasan Nagar",
    "routeStops": "SIDCO, MKB Nagar, Sathyamoorthy Nagar, Basin Bridge, Mint, Stanley, Beach R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "SIDCO",
      "MKB Nagar",
      "Sathyamoorthy Nagar",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Kaviarasu Kannadhasan Nagar"
    ]
  },
  {
    "busNo": "M116A",
    "start": "Broadway",
    "destination": "Muthamil Nagar (Kodungaiyur)",
    "routeStops": "SIDCO, MKB Nagar, Sathyamoorthy Nagar, Basin Bridge, Mint, Stanley, Beach R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "SIDCO",
      "MKB Nagar",
      "Sathyamoorthy Nagar",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Muthamil Nagar (Kodungaiyur)"
    ]
  },
  {
    "busNo": "M116L",
    "start": "Broadway",
    "destination": "Parvathi Nagar (Kodungaiyur)",
    "routeStops": "Muthamil Nagar, SIDCO, MKB Nagar, Sathyamoorthy Nagar, Basin Bridge, Mint, Stanley, Beach R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Muthamil Nagar",
      "SIDCO",
      "MKB Nagar",
      "Sathyamoorthy Nagar",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Parvathi Nagar (Kodungaiyur)"
    ]
  },
  {
    "busNo": "120",
    "start": "Broadway",
    "destination": "Avadi",
    "routeStops": "Central R.S, Purasaiwakkam, Sayani, ICF, Padi, Ambattur OT",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Purasaiwakkam",
      "Sayani",
      "ICF",
      "Padi",
      "Ambattur OT",
      "Avadi"
    ]
  },
  {
    "busNo": "120C",
    "start": "Broadway",
    "destination": "Thirumullaivoy al colony",
    "routeStops": "Central R.S, Purasaiwakkam, Sayani, ICF, Padi, Ambattur OT",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Purasaiwakkam",
      "Sayani",
      "ICF",
      "Padi",
      "Ambattur OT",
      "Thirumullaivoy al colony"
    ]
  },
  {
    "busNo": "142B",
    "start": "Broadway",
    "destination": "Peravallur Kumaran Nagar",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Peravallur Kumaran Nagar"
    ]
  },
  {
    "busNo": "142P",
    "start": "Broadway",
    "destination": "Puthagaram",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Puthagaram"
    ]
  },
  {
    "busNo": "153",
    "start": "Broadway",
    "destination": "Thirumazhisai",
    "routeStops": "Central R.S, KMC, Madhuravoyal, Poonamallee",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "KMC",
      "Madhuravoyal",
      "Poonamallee",
      "Thirumazhisai"
    ]
  },
  {
    "busNo": "164C",
    "start": "Broadway",
    "destination": "Manali",
    "routeStops": "",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Manali"
    ]
  },
  {
    "busNo": "502",
    "start": "Broadway",
    "destination": "Sriperumbudur",
    "routeStops": "Central R.S, LIC, Saidapet, Guindy, Porur, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "LIC",
      "Saidapet",
      "Guindy",
      "Porur",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "527",
    "start": "Broadway",
    "destination": "Thathamanji",
    "routeStops": "V.Nagar, Tondiarpet, Thiruvottriyur, Sathyamoorthy nagar, Minjur, Kadapakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "V.Nagar",
      "Tondiarpet",
      "Thiruvottriyur",
      "Sathyamoorthy nagar",
      "Minjur",
      "Kadapakkam",
      "Thathamanji"
    ]
  },
  {
    "busNo": "557",
    "start": "Broadway",
    "destination": "Gummidipoondi",
    "routeStops": "Beach R.S, Mint, Vyasarpadi, Moolakadai, Red Hills, Thachur Koot Road, Puduvayal, Kavarapettai",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Beach",
      "Mint",
      "Vyasarpadi",
      "Moolakadai",
      "Red Hills",
      "Thachur Koot Road",
      "Puduvayal",
      "Kavarapettai",
      "Gummidipoondi"
    ]
  },
  {
    "busNo": "587",
    "start": "Broadway",
    "destination": "Thirupporur",
    "routeStops": "Marina,Thiruvamiyur,ECR,Kelambakka m",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Marina",
      "Thiruvamiyur",
      "ECR",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "593",
    "start": "Broadway",
    "destination": "Thandalam",
    "routeStops": "Beach R.S,Stanley, Mint,Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Periyapalayam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Beach",
      "Stanley",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Periyapalayam",
      "Thandalam"
    ]
  },
  {
    "busNo": "521",
    "start": "Broadway, Chennai",
    "destination": "Thirupporur",
    "routeStops": "Marina,Thiruvanmiyur,Perungudi,Sholi nganallur,Kelambakkam",
    "areaSection": "Broadway",
    "stops": [
      "Broadway, Chennai",
      "Marina",
      "Thiruvanmiyur",
      "Perungudi",
      "Sholi nganallur",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "10E",
    "start": "Broadway",
    "destination": "Ekkaduthangal",
    "routeStops": "Central R.S, Egmore R.S, Maternity Hospital, DPI, Sterling road, Valluvar Kottam, Panagal park, T.Nagar, Srinivasa Theater, Mettupalayam, Ashok Nagar, Jaffarkhanpet",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Chennai Egmore",
      "Maternity Hospital",
      "DPI",
      "Sterling road",
      "Valluvar Kottam",
      "Panagal park",
      "T.Nagar",
      "Srinivasa Theater",
      "Mettupalayam",
      "Ashok Nagar",
      "Jaffarkhanpet",
      "Ekkaduthangal"
    ]
  },
  {
    "busNo": "M21T",
    "start": "Broadway",
    "destination": "Kannagi Nagar",
    "routeStops": "Santhome, Adyar, Perungudi",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Santhome",
      "Adyar",
      "Perungudi",
      "Kannagi Nagar"
    ]
  },
  {
    "busNo": "35",
    "start": "Broadway",
    "destination": "Ayanavaram",
    "routeStops": "Sayani, Kellys, Purasaiwakkam, Choolai P.O, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Sayani",
      "Kellys",
      "Purasaiwakkam",
      "Choolai P.O",
      "Chennai Central",
      "Ayanavaram"
    ]
  },
  {
    "busNo": "38H",
    "start": "Broadway",
    "destination": "Madhavaram",
    "routeStops": "Thapal Petti, Moolakadai, Sharma nagar, Vyasarpadi, Basin Bridge, Mint, Stanley, Beach R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Thapal Petti",
      "Moolakadai",
      "Sharma nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Madhavaram"
    ]
  },
  {
    "busNo": "51D",
    "start": "Broadway",
    "destination": "Tambaram East",
    "routeStops": "Convent, Camp road, Rajakilpakkam, Kozhipannai, Madambakkam, Jothi Nagar, Noothencherry, Vengaivasal, Santhosapuram, Medavakkam Koot road, Medavakkam, Pallikaranai, Velacherry, Saidapet, DMS, TVS, LIC, Central",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Convent",
      "Camp road",
      "Rajakilpakkam",
      "Kozhipannai",
      "Madambakkam",
      "Jothi Nagar",
      "Noothencherry",
      "Vengaivasal",
      "Santhosapuram",
      "Medavakkam Koot road",
      "Medavakkam",
      "Pallikaranai",
      "Velacherry",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Central",
      "Tambaram East"
    ]
  },
  {
    "busNo": "H51",
    "start": "Broadway",
    "destination": "Tambaram East",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Luz, Mylapore, Mandaveli BS, AMS, Adyar Depot, SRP tools, Taramani, Velachery, Pallikaranai, Medavakkam, Santhosapuram, Kamarajapuram, Camp road, Convent",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "AMS",
      "Adyar Depot",
      "SRP tools",
      "Taramani",
      "Velachery",
      "Pallikaranai",
      "Medavakkam",
      "Santhosapuram",
      "Kamarajapuram",
      "Camp road",
      "Convent",
      "Tambaram East"
    ]
  },
  {
    "busNo": "52",
    "start": "Broadway",
    "destination": "Pozhichalur",
    "routeStops": "Pallavaram, Guindy, Saidapet, DMS, TVS, LIC, Central RS",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Pozhichalur"
    ]
  },
  {
    "busNo": "52D",
    "start": "Broadway",
    "destination": "Chitlapakkam",
    "routeStops": "Varadharaja Theater, Chromepet,Pallavaram, Guind y, Saidapet, DMS, TVS, LIC, Central RS",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Varadharaja Theater",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Chitlapakkam"
    ]
  },
  {
    "busNo": "53P",
    "start": "Broadway",
    "destination": "Pattur",
    "routeStops": "Mangadu, Kumananchavadi, Mathruvayoil, Arumbakkam, Aminijikarai, KMC, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Mangadu",
      "Kumananchavadi",
      "Mathruvayoil",
      "Arumbakkam",
      "Aminijikarai",
      "KMC",
      "Chennai Central",
      "Pattur"
    ]
  },
  {
    "busNo": "54",
    "start": "Broadway",
    "destination": "Poonamallee",
    "routeStops": "Kumananchavadi, Porur, Guindy, DMS, TVS, LIC, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Kumananchavadi",
      "Porur",
      "Guindy",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Poonamallee"
    ]
  },
  {
    "busNo": "54G",
    "start": "Broadway",
    "destination": "Kuthambakkam",
    "routeStops": "Vellavedu, Thirumazhisai, Poonamallee, Porur, Guindy, DMS, TVS, LIC, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Vellavedu",
      "Thirumazhisai",
      "Poonamallee",
      "Porur",
      "Guindy",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Kuthambakkam"
    ]
  },
  {
    "busNo": "60C",
    "start": "Broadway",
    "destination": "Anakaputhur",
    "routeStops": "Pammal, Pallavaram, Guindy, Little Mount, Saidapet, Teynampet, DMS, TVS, Simpson, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Pammal",
      "Pallavaram",
      "Guindy",
      "Little Mount",
      "Saidapet",
      "Teynampet",
      "DMS",
      "TVS",
      "Simpson",
      "Chennai Central",
      "Anakaputhur"
    ]
  },
  {
    "busNo": "155A",
    "start": "Broadway",
    "destination": "Thirumudivakk am",
    "routeStops": "Thiruneermalai, Nagakeni, Pallavaram, Guindy, Saidape t, DMS, LIC, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Thiruneermalai",
      "Nagakeni",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "LIC",
      "Chennai Central",
      "Thirumudivakk am"
    ]
  },
  {
    "busNo": "242",
    "start": "Broadway",
    "destination": "Red Hills",
    "routeStops": "Central R.S, Vepery, Doveton, Perambur, Kolathur, Puzhal",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Vepery",
      "Doveton",
      "Perambur",
      "Kolathur",
      "Puzhal",
      "Red Hills"
    ]
  },
  {
    "busNo": "242xt",
    "start": "Broadway",
    "destination": "Padiyanallur",
    "routeStops": "Perambur, Central R.S",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Perambur",
      "Chennai Central",
      "Padiyanallur"
    ]
  },
  {
    "busNo": "553",
    "start": "Broadway",
    "destination": "Sriperumbudur",
    "routeStops": "Central R.S, KMC, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "KMC",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "571",
    "start": "Broadway",
    "destination": "Thiruvallur",
    "routeStops": "Central R.S, Taylors Road, Nadhamuni, Padi, Ambattur IE, Avadi, Thirunindravur, Vepampattu, Sevapet, Kakallur",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Chennai Central",
      "Taylors Road",
      "Nadhamuni",
      "Padi",
      "Ambattur IE",
      "Avadi",
      "Thirunindravur",
      "Vepampattu",
      "Sevapet",
      "Kakallur",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "579",
    "start": "Broadway",
    "destination": "Padappai",
    "routeStops": "Karasangal, Mudichur, Tambaram, Pallavaram, Guindy, Saidapet, LIC",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Karasangal",
      "Mudichur",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "LIC",
      "Padappai"
    ]
  },
  {
    "busNo": "588B",
    "start": "Broadway",
    "destination": "Mamallapuram",
    "routeStops": "Marina Beach, Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "Broadway",
    "stops": [
      "Broadway",
      "Marina Beach",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "Mamallapuram"
    ]
  },
  {
    "busNo": "M500",
    "start": "Chengalpat tu",
    "destination": "Tambaram",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Perugalathur",
    "areaSection": "Chengalpet",
    "stops": [
      "Chengalpat tu",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Perugalathur",
      "Tambaram"
    ]
  },
  {
    "busNo": "500",
    "start": "Chengalpat tu",
    "destination": "T. Nagar",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Pallavaram, Guindy,",
    "areaSection": "Chengalpet",
    "stops": [
      "Chengalpat tu",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "T. Nagar"
    ]
  },
  {
    "busNo": "500A",
    "start": "Chengalpat tu",
    "destination": "Hasthinapuram",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Tambaram Sanatorium, Nehru nagar(Chromepet), Kumaran Kundram",
    "areaSection": "Chengalpet",
    "stops": [
      "Chengalpat tu",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Tambaram Sanatorium",
      "Nehru nagar(Chromepet)",
      "Kumaran Kundram",
      "Hasthinapuram"
    ]
  },
  {
    "busNo": "500C",
    "start": "Chengalpat tu",
    "destination": "CMBT",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Pallavaram, Guindy, Saidapet",
    "areaSection": "Chengalpet",
    "stops": [
      "Chengalpat tu",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "CMBT"
    ]
  },
  {
    "busNo": "500J",
    "start": "Chengalpat tu",
    "destination": "Velachery",
    "routeStops": "Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road, Tambaram East, Tambaram West, Vandalur Zoo",
    "areaSection": "Chengalpet",
    "stops": [
      "Chengalpat tu",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Tambaram East",
      "Tambaram West",
      "Vandalur Zoo",
      "Velachery"
    ]
  },
  {
    "busNo": "500V",
    "start": "Chengalpat tu",
    "destination": "Velachery",
    "routeStops": "Guindy, Pallvaram, Tambaram West, Vandalur Zoo",
    "areaSection": "Chengalpet",
    "stops": [
      "Chengalpat tu",
      "Guindy",
      "Pallvaram",
      "Tambaram West",
      "Vandalur Zoo",
      "Velachery"
    ]
  },
  {
    "busNo": "577",
    "start": "Chengalpat tu",
    "destination": "Mandaveli",
    "routeStops": "Singaperumal Koil, Maraimalai Nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Pallavaram, Guindy, Adyar, AMS",
    "areaSection": "Chengalpet",
    "stops": [
      "Chengalpat tu",
      "Singaperumal Koil",
      "Maraimalai Nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Adyar",
      "AMS",
      "Mandaveli"
    ]
  },
  {
    "busNo": "52D",
    "start": "Chitlapakkam",
    "destination": "Broadway",
    "routeStops": "Varadharaja Theater, Chromepet,Pallavaram, Guind y, Saidapet, DMS, TVS, LIC, Central RS",
    "areaSection": "Chitlapakkam",
    "stops": [
      "Chitlapakkam",
      "Varadharaja Theater",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "27B",
    "start": "CMBT",
    "destination": "Anna Square",
    "routeStops": "Koyambedu, Arumbakkam, NSK nagar,Amijikarai, KMC, Chetpet, MMC School, Egmore RS, Chindatripet, Zimson, Triplicane, Kannaki Statue",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Koyambedu",
      "Arumbakkam",
      "NSK nagar",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "MMC School",
      "Chennai Egmore",
      "Chindatripet",
      "Zimson",
      "Triplicane",
      "Kannaki Statue",
      "Anna Square"
    ]
  },
  {
    "busNo": "46",
    "start": "CMBT",
    "destination": "TVK Nagar",
    "routeStops": "Perambur, Ayanavaram, ICF, Anna Nagar East, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Perambur",
      "Ayanavaram",
      "ICF",
      "Anna Nagar East",
      "Arumbakkam",
      "TVK Nagar"
    ]
  },
  {
    "busNo": "46B",
    "start": "CMBT",
    "destination": "Periyar Nagar",
    "routeStops": "Perambur, Ayanavaram, ICF, Anna Nagar East, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Perambur",
      "Ayanavaram",
      "ICF",
      "Anna Nagar East",
      "Arumbakkam",
      "Periyar Nagar"
    ]
  },
  {
    "busNo": "46C",
    "start": "CMBT",
    "destination": "Parvathy Nagar (Kodungaiyur)",
    "routeStops": "Moolakadai, Perambur, Ayanavaram, ICF, Anna Nagar East, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Moolakadai",
      "Perambur",
      "Ayanavaram",
      "ICF",
      "Anna Nagar East",
      "Arumbakkam",
      "Parvathy Nagar (Kodungaiyur)"
    ]
  },
  {
    "busNo": "46G",
    "start": "CMBT",
    "destination": "MKB Nagar East",
    "routeStops": "Vyasarpadi, Ayanavaram, ICF, Anna Nagar East, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Vyasarpadi",
      "Ayanavaram",
      "ICF",
      "Anna Nagar East",
      "Arumbakkam",
      "MKB Nagar East"
    ]
  },
  {
    "busNo": "48C",
    "start": "CMBT",
    "destination": "Vallalar Nagar",
    "routeStops": "Thirumangalam, Anna Nagar West, Nadhamuni, ICF, Railway Quarters, Joint Office, Sayani, Otterri, Basin Bridge",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Thirumangalam",
      "Anna Nagar West",
      "Nadhamuni",
      "ICF",
      "Railway Quarters",
      "Joint Office",
      "Sayani",
      "Otterri",
      "Basin Bridge",
      "Vallalar Nagar"
    ]
  },
  {
    "busNo": "PP49",
    "start": "CMBT",
    "destination": "Kovalam",
    "routeStops": "MMDA Colony, Vadapalani, Liberty, T.Nagar, Saidapet, Adyar, Thiruvanmiyur, Kottivakkam, Palavakkam, Injambakkam, Kanathur, Muttukadu",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "MMDA Colony",
      "Vadapalani",
      "Liberty",
      "T.Nagar",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Kottivakkam",
      "Palavakkam",
      "Injambakkam",
      "Kanathur",
      "Muttukadu",
      "Kovalam"
    ]
  },
  {
    "busNo": "L51",
    "start": "CMBT",
    "destination": "Ottiambakkam",
    "routeStops": "Arasan Kazhani, Sithalapakkam, Medavakkam, Pallikaranai, Velacherry, Checkpost, Guindy, Ashok Pillar, Vadapalani, MMDA Colony",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Arasan Kazhani",
      "Sithalapakkam",
      "Medavakkam",
      "Pallikaranai",
      "Velacherry",
      "Checkpost",
      "Guindy",
      "Ashok Pillar",
      "Vadapalani",
      "MMDA Colony",
      "Ottiambakkam"
    ]
  },
  {
    "busNo": "53K",
    "start": "CMBT",
    "destination": "Meppur",
    "routeStops": "Mathruvayoil, Kumananchavadi, Poonamallee,",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Mathruvayoil",
      "Kumananchavadi",
      "Poonamallee",
      "Meppur"
    ]
  },
  {
    "busNo": "61B",
    "start": "CMBT",
    "destination": "Arakkambakkam",
    "routeStops": "Thirumangalam, Collector Nagar, Ambattur IE, Avadi, HVF Hospital, Kovilpadagai, Vellanur, Veerapuram",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Thirumangalam",
      "Collector Nagar",
      "Ambattur IE",
      "Avadi",
      "HVF Hospital",
      "Kovilpadagai",
      "Vellanur",
      "Veerapuram",
      "Arakkambakkam"
    ]
  },
  {
    "busNo": "70S",
    "start": "CMBT",
    "destination": "Kannagi Nagar",
    "routeStops": "Velachery, SRP Tools",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Velachery",
      "SRP Tools",
      "Kannagi Nagar"
    ]
  },
  {
    "busNo": "M70",
    "start": "CMBT",
    "destination": "Thiruvanmiyur",
    "routeStops": "Vadapalani, Ashok nagar, Guindy, Checkpost, Velacherry, Taramani, SRP tools, Jayanthi",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Checkpost",
      "Velacherry",
      "Taramani",
      "SRP tools",
      "Jayanthi",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "M70A",
    "start": "CMBT",
    "destination": "Avadi",
    "routeStops": "Ambattur O.T, Collector Nagar",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Ambattur O.T",
      "Collector Nagar",
      "Avadi"
    ]
  },
  {
    "busNo": "121A",
    "start": "CMBT",
    "destination": "Manali",
    "routeStops": "Madhavaram Milk Colony, Thapal petti, Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Madhavaram Milk Colony",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "Manali"
    ]
  },
  {
    "busNo": "121B",
    "start": "CMBT",
    "destination": "Minjur",
    "routeStops": "Napalayam, MFL, CPCL, Manali, Madhavaram Milk Colony, Thapal petti, Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Napalayam",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk Colony",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "Minjur"
    ]
  },
  {
    "busNo": "121C",
    "start": "CMBT",
    "destination": "Ennore",
    "routeStops": "Ernavoor gate, MFL, CPCL, Manali, Madhavaram Milk Colony, Thapal petti, Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Ernavoor gate",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk Colony",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "Ennore"
    ]
  },
  {
    "busNo": "121D",
    "start": "CMBT",
    "destination": "Manali New Town",
    "routeStops": "MFL, CPCL, Manali, Madhavaram Milk Colony, Thapal petti, Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk Colony",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "Manali New Town"
    ]
  },
  {
    "busNo": "121G",
    "start": "CMBT",
    "destination": "Kaviarasu Kannadasan Nagar",
    "routeStops": "Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "Kaviarasu Kannadasan Nagar"
    ]
  },
  {
    "busNo": "159D",
    "start": "CMBT",
    "destination": "I.O.C",
    "routeStops": "Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "I.O.C"
    ]
  },
  {
    "busNo": "159E",
    "start": "CMBT",
    "destination": "Ennore",
    "routeStops": "Ashok Leyland, Ernavoor Gate, Thiruvottriyur, Therady, Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Ashok Leyland",
      "Ernavoor Gate",
      "Thiruvottriyur",
      "Therady",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "Ennore"
    ]
  },
  {
    "busNo": "170J",
    "start": "CMBT",
    "destination": "Guindy",
    "routeStops": "West Saidapet , Udhayam, Vadapalani, MMDA Colony",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "West Saidapet",
      "Udhayam",
      "Vadapalani",
      "MMDA Colony",
      "Guindy"
    ]
  },
  {
    "busNo": "170R",
    "start": "CMBT",
    "destination": "Andarkuppam",
    "routeStops": "Thirumangalam, Madhavaram, Kosappur",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Thirumangalam",
      "Madhavaram",
      "Kosappur",
      "Andarkuppam"
    ]
  },
  {
    "busNo": "270J",
    "start": "CMBT",
    "destination": "Mathur",
    "routeStops": "Thirumangalam, Madhavaram",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Thirumangalam",
      "Madhavaram",
      "Mathur"
    ]
  },
  {
    "busNo": "558L",
    "start": "CMBT",
    "destination": "Minjur",
    "routeStops": "Redhills, Karanodai, Ponneri",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Redhills",
      "Karanodai",
      "Ponneri",
      "Minjur"
    ]
  },
  {
    "busNo": "568C",
    "start": "CMBT",
    "destination": "Mamallapuram",
    "routeStops": "Rajiv Gandhi Salai",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Rajiv Gandhi Salai",
      "Mamallapuram"
    ]
  },
  {
    "busNo": "568T",
    "start": "CMBT",
    "destination": "Thalambur",
    "routeStops": "Guindy, SRP Tools, Sholinganallur, Navalur",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Guindy",
      "SRP Tools",
      "Sholinganallur",
      "Navalur",
      "Thalambur"
    ]
  },
  {
    "busNo": "570",
    "start": "CMBT",
    "destination": "Kelambakkam",
    "routeStops": "Vadapalani, Ashok Nagar, Guindy, Check post, Velachery, SRP tools, Perungudi, Sholinganallur, Navalur, Padur",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Check post",
      "Velachery",
      "SRP tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Padur",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "570S",
    "start": "CMBT",
    "destination": "SiruseriSIPCOT",
    "routeStops": "Vadapalani, Ashok Nagar, Guindy, Check post, Velachery, SRP tools, Perungudi, Sholinganallur, Navalur",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Check post",
      "Velachery",
      "SRP tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "SiruseriSIPCOT"
    ]
  },
  {
    "busNo": "596",
    "start": "CMBT",
    "destination": "Thiruvallur",
    "routeStops": "Koyambedu, Nerkundram, Madhuravoyal, Kumanan chavadi, Poonamallee, Thirumazhisai, Vellavedu, Nemam, Pudhuchatiram, Mettukandigai, Arnavoyal kuppam, Arnavoyal, Murkancherry, Manavalan Nagar",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Koyambedu",
      "Nerkundram",
      "Madhuravoyal",
      "Kumanan chavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Nemam",
      "Pudhuchatiram",
      "Mettukandigai",
      "Arnavoyal kuppam",
      "Arnavoyal",
      "Murkancherry",
      "Manavalan Nagar",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "596A",
    "start": "CMBT",
    "destination": "Thiruvallur - Pandur",
    "routeStops": "Koyambedu, Nerkundram, Madhuravoyal, Kumanan chavadi, Poonamallee, Thirumazhisai, Vellavedu, Nemam, Pudhuchatiram, Mettukandigai, Arnavoyal kuppam, Arnavoyal, Murkancherry, Manavalan Nagar, Thiruvallur",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Koyambedu",
      "Nerkundram",
      "Madhuravoyal",
      "Kumanan chavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Nemam",
      "Pudhuchatiram",
      "Mettukandigai",
      "Arnavoyal kuppam",
      "Arnavoyal",
      "Murkancherry",
      "Manavalan Nagar",
      "Thiruvallur",
      "Thiruvallur - Pandur"
    ]
  },
  {
    "busNo": "15B",
    "start": "CMBT",
    "destination": "Broadway",
    "routeStops": "Amijikarai, KMC, Dasaprakash, Central R.S",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Amijikarai",
      "KMC",
      "Dasaprakash",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "17A",
    "start": "CMBT",
    "destination": "Broadway",
    "routeStops": "Koyambedu Market, Virugambakkam, Vadapalani, Gemini",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Koyambedu Market",
      "Virugambakkam",
      "Vadapalani",
      "Gemini",
      "Broadway"
    ]
  },
  {
    "busNo": "20J",
    "start": "CMBT",
    "destination": "Ayyapakkam",
    "routeStops": "",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Ayyapakkam"
    ]
  },
  {
    "busNo": "23M",
    "start": "CMBT",
    "destination": "Thiruvanmiyur",
    "routeStops": "Jayanthi, Adyar, Gandhi mandapam, Little mount, Saidapet, T.Nagar, Panagal park, Liberty, Power house, Vadapalani, MMDA Colony",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Jayanthi",
      "Adyar",
      "Gandhi mandapam",
      "Little mount",
      "Saidapet",
      "T.Nagar",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "23M cut",
    "start": "CMBT",
    "destination": "Besant nagar",
    "routeStops": "Adyar, Gandhi mandapam, Little mount, Saidapet, T.Nagar, Panagal park, Liberty, Power house, Vadapalani, MMDA Colony",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Adyar",
      "Gandhi mandapam",
      "Little mount",
      "Saidapet",
      "T.Nagar",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "Besant nagar"
    ]
  },
  {
    "busNo": "M27",
    "start": "CMBT",
    "destination": "T. Nagar",
    "routeStops": "Panagal park, Bharathinagar, Liberty, Power house, Vadapalani, Virugambakkam, Chinmaya nagar, Koyambedu Market",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Panagal park",
      "Bharathinagar",
      "Liberty",
      "Power house",
      "Vadapalani",
      "Virugambakkam",
      "Chinmaya nagar",
      "Koyambedu Market",
      "T. Nagar"
    ]
  },
  {
    "busNo": "41F",
    "start": "CMBT",
    "destination": "Mandaveli",
    "routeStops": "Luz, Gemini, Valluvar Kottam, Loyola College, Choolaimedu, Anna Arch",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Luz",
      "Gemini",
      "Valluvar Kottam",
      "Loyola College",
      "Choolaimedu",
      "Anna Arch",
      "Mandaveli"
    ]
  },
  {
    "busNo": "51L",
    "start": "CMBT",
    "destination": "Tambaram East",
    "routeStops": "Vadapalani, Guindy, Velachery, Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "53S",
    "start": "CMBT",
    "destination": "Pattabiram",
    "routeStops": "Thiruverkadu, Sundaransozhapuram, Mettupalayam,Thandarai",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Thiruverkadu",
      "Sundaransozhapuram",
      "Mettupalayam",
      "Thandarai",
      "Pattabiram"
    ]
  },
  {
    "busNo": "70K",
    "start": "CMBT",
    "destination": "Kilkattalai",
    "routeStops": "Velachery, Guindy, Ashok Pillar, Vadapalani",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Velachery",
      "Guindy",
      "Ashok Pillar",
      "Vadapalani",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "70L",
    "start": "CMBT",
    "destination": "Ambattur Karukku",
    "routeStops": "",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Ambattur Karukku"
    ]
  },
  {
    "busNo": "H70",
    "start": "CMBT",
    "destination": "Menambedu",
    "routeStops": "Ambattur OT",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Ambattur OT",
      "Menambedu"
    ]
  },
  {
    "busNo": "159A",
    "start": "CMBT",
    "destination": "Thiruvotriyur",
    "routeStops": "Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "Thiruvotriyur"
    ]
  },
  {
    "busNo": "159B",
    "start": "CMBT",
    "destination": "Tollgate",
    "routeStops": "Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "Tollgate"
    ]
  },
  {
    "busNo": "170S",
    "start": "CMBT",
    "destination": "MKB Nagar East",
    "routeStops": "Sarma Nagar, Moolakadai, Retteri, Thirumangalam, DMDK Office",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Sarma Nagar",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "DMDK Office",
      "MKB Nagar East"
    ]
  },
  {
    "busNo": "J170",
    "start": "CMBT",
    "destination": "Guindy",
    "routeStops": "Ashok pillar, K.K.Nagar BS, MGR nagar, Nesapakkam, West K.K.nagar, Avichi School, Virugambakkam, Chinmaya Nagar, Koyambedu Market",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Ashok pillar",
      "K.K.Nagar BS",
      "MGR nagar",
      "Nesapakkam",
      "West K.K.nagar",
      "Avichi School",
      "Virugambakkam",
      "Chinmaya Nagar",
      "Koyambedu Market",
      "Guindy"
    ]
  },
  {
    "busNo": "500C",
    "start": "CMBT",
    "destination": "Chengalpattu",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Pallavaram, Guindy, Saidapet",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "Chengalpattu"
    ]
  },
  {
    "busNo": "510",
    "start": "CMBT",
    "destination": "Padappai",
    "routeStops": "Karasangal, Mudichur, Tambaram, Pallavaram, Ashok Pillar",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Karasangal",
      "Mudichur",
      "Tambaram",
      "Pallavaram",
      "Ashok Pillar",
      "Padappai"
    ]
  },
  {
    "busNo": "514",
    "start": "CMBT",
    "destination": "Periyapalayam",
    "routeStops": "Lucas, Puzhal, Red Hills, Karanodai,Janappan chathram x road, Bandikavanoor,Kannigaipair",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Lucas",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Janappan chathramx road",
      "Bandikavanoor",
      "Kannigaipair",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "533",
    "start": "CMBT",
    "destination": "Arani",
    "routeStops": "",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Arani"
    ]
  },
  {
    "busNo": "553A",
    "start": "CMBT",
    "destination": "Sriperumbudur",
    "routeStops": "Mathruvayoil, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Mathruvayoil",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "588C",
    "start": "CMBT",
    "destination": "Mamallapuram",
    "routeStops": "Vadapalani, Ashok Nagar, Guindy, Adyar, Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "CMBT",
    "stops": [
      "CMBT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Adyar",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "Mamallapuram"
    ]
  },
  {
    "busNo": "21F",
    "start": "Egmore",
    "destination": "Kannagi nagar",
    "routeStops": "",
    "areaSection": "Egmore",
    "stops": [
      "Egmore",
      "Kannagi nagar"
    ]
  },
  {
    "busNo": "40A xt",
    "start": "Egmore",
    "destination": "Veppampattu",
    "routeStops": "KMC, Aminijikarai, Chinthamani, Blue Star, Collector Nagar, Ambattur OT, Avadi, Pattabiram, Thirunindravur",
    "areaSection": "Egmore",
    "stops": [
      "Egmore",
      "KMC",
      "Aminijikarai",
      "Chinthamani",
      "Blue Star",
      "Collector Nagar",
      "Ambattur OT",
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Veppampattu"
    ]
  },
  {
    "busNo": "28",
    "start": "Chennai Egmore",
    "destination": "Thiruvotriyur",
    "routeStops": "Tollgate,Tondiarpet,Vallalarnagar,Regal , Central RS, Chindatripet",
    "areaSection": "Egmore Railway Station",
    "stops": [
      "Chennai Egmore",
      "Tollgate",
      "Tondiarpet",
      "Vallalarnagar",
      "Regal",
      "Chennai Central",
      "Chindatripet",
      "Thiruvotriyur"
    ]
  },
  {
    "busNo": "28A",
    "start": "Chennai Egmore",
    "destination": "Manali",
    "routeStops": "Andankuppam, Thiruvottriyur, Tollgate, Tondiarpet, Vallalarnagar, Regal, Central RS",
    "areaSection": "Egmore Railway Station",
    "stops": [
      "Chennai Egmore",
      "Andankuppam",
      "Thiruvottriyur",
      "Tollgate",
      "Tondiarpet",
      "Vallalarnagar",
      "Regal",
      "Chennai Central",
      "Manali"
    ]
  },
  {
    "busNo": "28B",
    "start": "Chennai Egmore",
    "destination": "Ennore",
    "routeStops": "Ernavoor, Thiruvottriyur, Tollgate, Tondiarpet, Vallalarnagar, Regal, Central RS, Chindatripet",
    "areaSection": "Egmore Railway Station",
    "stops": [
      "Chennai Egmore",
      "Ernavoor",
      "Thiruvottriyur",
      "Tollgate",
      "Tondiarpet",
      "Vallalarnagar",
      "Regal",
      "Chennai Central",
      "Chindatripet",
      "Ennore"
    ]
  },
  {
    "busNo": "10E",
    "start": "Ekkadutha ngal",
    "destination": "Broadway",
    "routeStops": "Central R.S, Egmore R.S, Maternity Hospital, DPI, Sterling road, Valluvar Kottam, Panagal park, T.Nagar, Srinivasa Theater, Mettupalayam, Ashok Nagar, Jaffarkhanpet",
    "areaSection": "Ekkaduthangal",
    "stops": [
      "Ekkadutha ngal",
      "Chennai Central",
      "Chennai Egmore",
      "Maternity Hospital",
      "DPI",
      "Sterling road",
      "Valluvar Kottam",
      "Panagal park",
      "T.Nagar",
      "Srinivasa Theater",
      "Mettupalayam",
      "Ashok Nagar",
      "Jaffarkhanpet",
      "Broadway"
    ]
  },
  {
    "busNo": "88E",
    "start": "Ekkadttuth angal",
    "destination": "Kundrathur",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy",
    "areaSection": "Ekkaduthangal",
    "stops": [
      "Ekkadttuth angal",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Kundrathur"
    ]
  },
  {
    "busNo": "K18 cut",
    "start": "Ekkadutha ngal",
    "destination": "Broadway",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Teynampet, Nandanam, Saidapet, Guindy,CIPET",
    "areaSection": "Ekkaduthangal",
    "stops": [
      "Ekkadutha ngal",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Teynampet",
      "Nandanam",
      "Saidapet",
      "Guindy",
      "CIPET",
      "Broadway"
    ]
  },
  {
    "busNo": "M21G xt",
    "start": "Ekkadutha ngal",
    "destination": "Broadway",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Sanskrit College, Luz, Mylapore, Mandaveli BS, Adyar Gate, Kotturpuram, Anna university, Guindy",
    "areaSection": "Ekkaduthangal",
    "stops": [
      "Ekkadutha ngal",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Sanskrit College",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "Adyar Gate",
      "Kotturpuram",
      "Anna university",
      "Guindy",
      "Broadway"
    ]
  },
  {
    "busNo": "154E",
    "start": "Ekkadutha ngal",
    "destination": "Vellavedu",
    "routeStops": "Poonamallee, Kumananchavadi, Porur, Guindy",
    "areaSection": "Ekkaduthangal",
    "stops": [
      "Ekkadutha ngal",
      "Poonamallee",
      "Kumananchavadi",
      "Porur",
      "Guindy",
      "Vellavedu"
    ]
  },
  {
    "busNo": "M70D",
    "start": "Elango Nagar (Collector Nagar)",
    "destination": "Guindy",
    "routeStops": "Thirumangalam, CMBT, Vadapalani, Ashok Pillar",
    "areaSection": "Elango Nagar (Collector Nagar)",
    "stops": [
      "Elango Nagar (Collector Nagar)",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy"
    ]
  },
  {
    "busNo": "27E",
    "start": "Elango nagar officer colony",
    "destination": "Anna Square",
    "routeStops": "Collector nagar, Thirumangalam, Rountana, Amijikarai, KMC, Egmore RS, Zimson, Triplicane, Kannaki Statue",
    "areaSection": "Elango Nagar (Collector Nagar)",
    "stops": [
      "Elango nagar officer colony",
      "Collector nagar",
      "Thirumangalam",
      "Rountana",
      "Amijikarai",
      "KMC",
      "Chennai Egmore",
      "Zimson",
      "Triplicane",
      "Kannaki Statue",
      "Anna Square"
    ]
  },
  {
    "busNo": "1E",
    "start": "Ennore",
    "destination": "Tambaram",
    "routeStops": "Chromepet, Pallavaram, Guindy, Teynampet, D.M.S, L.I.C, Central R.S, Parry's Corner, Kalmandapam, Tollgate, Thiruvottiyur",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Teynampet",
      "D.M.S",
      "L.I.C",
      "Chennai Central",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Thiruvottiyur",
      "Tambaram"
    ]
  },
  {
    "busNo": "1D",
    "start": "Ennore",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, Mylapore, Royapettah, Parry's Corner, Kalmandapam, Thalankuppam",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Parry's Corner",
      "Kalmandapam",
      "Thalankuppam",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "28B",
    "start": "Ennore",
    "destination": "Chennai Egmore",
    "routeStops": "Ernavoor, Thiruvottriyur, Tollgate, Tondiarpet, Vallalarnagar, Regal, Central RS, Chindatripet",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Ernavoor",
      "Thiruvottriyur",
      "Tollgate",
      "Tondiarpet",
      "Vallalarnagar",
      "Regal",
      "Chennai Central",
      "Chindatripet",
      "Chennai Egmore"
    ]
  },
  {
    "busNo": "48B",
    "start": "Ennore",
    "destination": "Thiru.Vi.Ka Nagar",
    "routeStops": "Venus, Perambur, Moolakadai, Madhavaram, Mathur Koot road, Manali Koot road, Sathyamoorthy nagar, Ernavoor, Ashok Leyeland",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Venus",
      "Perambur",
      "Moolakadai",
      "Madhavaram",
      "Mathur Koot road",
      "Manali Koot road",
      "Sathyamoorthy nagar",
      "Ernavoor",
      "Ashok Leyeland",
      "Thiru.Vi.Ka Nagar"
    ]
  },
  {
    "busNo": "56 xt",
    "start": "Ennore",
    "destination": "Broadway",
    "routeStops": "V.Nagar, Tondiarpet, Thiruvottriyur, Ernavoor, Ashok Leyland",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "V.Nagar",
      "Tondiarpet",
      "Thiruvottriyur",
      "Ernavoor",
      "Ashok Leyland",
      "Broadway"
    ]
  },
  {
    "busNo": "56A",
    "start": "Ennore",
    "destination": "V Nagar",
    "routeStops": "",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "V Nagar"
    ]
  },
  {
    "busNo": "56N",
    "start": "Ennore",
    "destination": "Broadway",
    "routeStops": "",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Broadway"
    ]
  },
  {
    "busNo": "121C",
    "start": "Ennore",
    "destination": "CMBT",
    "routeStops": "Ernavoor gate, MFL, CPCL, Manali, Madhavaram Milk Colony, Thapal petti, Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Ernavoor gate",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk Colony",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "CMBT"
    ]
  },
  {
    "busNo": "157E",
    "start": "Ennore",
    "destination": "Red Hills",
    "routeStops": "Puzhal, Moolakadai,Sharma Nagar, M.K.B Nagar, Korukkupettai, Tondaripet, Tollgate, Theradi, Thiruvottiyur",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Puzhal",
      "Moolakadai",
      "Sharma Nagar",
      "M.K.B Nagar",
      "Korukkupettai",
      "Tondaripet",
      "Tollgate",
      "Theradi",
      "Thiruvottiyur",
      "Red Hills"
    ]
  },
  {
    "busNo": "159E",
    "start": "Ennore",
    "destination": "CMBT",
    "routeStops": "Ashok Leyland, Ernavoor Gate, Thiruvottriyur, Therady, Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "Ennore",
    "stops": [
      "Ennore",
      "Ashok Leyland",
      "Ernavoor Gate",
      "Thiruvottriyur",
      "Therady",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "CMBT"
    ]
  },
  {
    "busNo": "12B xt",
    "start": "Foreshore Estate",
    "destination": "Koyambedu Ma rket",
    "routeStops": "CMBT, MMDA Colony, Vadapalani, Kodambakkam, Pondy Bazaar, Alwarpet, Luz, Santhome",
    "areaSection": "Foreshore Estate",
    "stops": [
      "Foreshore Estate",
      "CMBT",
      "MMDA Colony",
      "Vadapalani",
      "Kodambakkam",
      "Pondy Bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "Koyambedu Ma rket"
    ]
  },
  {
    "busNo": "12B xt",
    "start": "Foreshore Estate",
    "destination": "Iyyapanthangal",
    "routeStops": "Porur, Virugambakkam, Vadapalani, Liberty, Pondy Bazaar, Alwarpet, Luz, Santhome",
    "areaSection": "Foreshore Estate",
    "stops": [
      "Foreshore Estate",
      "Porur",
      "Virugambakkam",
      "Vadapalani",
      "Liberty",
      "Pondy Bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "27D",
    "start": "Foreshore Estate",
    "destination": "Villivakkam",
    "routeStops": "Santhome, AIR, V.M.Street, Stella Maris College, Thousand Lights, LIC, Pudhupet, Maternity Hospital, Egmore RS, Dasaprakash, Purasaiwakkam, Kellys, Ayanavaram, ICF",
    "areaSection": "Foreshore Estate",
    "stops": [
      "Foreshore Estate",
      "Santhome",
      "AIR",
      "V.M.Street",
      "Stella Maris College",
      "Thousand Lights",
      "LIC",
      "Pudhupet",
      "Maternity Hospital",
      "Chennai Egmore",
      "Dasaprakash",
      "Purasaiwakkam",
      "Kellys",
      "Ayanavaram",
      "ICF",
      "Villivakkam"
    ]
  },
  {
    "busNo": "12A",
    "start": "Foreshore Estate",
    "destination": "T. Nagar",
    "routeStops": "Pondy bazaar,Alwarpet, Luz, Santhome",
    "areaSection": "Foreshore Estate",
    "stops": [
      "Foreshore Estate",
      "Pondy bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "T. Nagar"
    ]
  },
  {
    "busNo": "M12A",
    "start": "Foreshore Estate",
    "destination": "T. Nagar",
    "routeStops": "Pondy bazaar,Alwarpet, Luz, Santhome",
    "areaSection": "Foreshore Estate",
    "stops": [
      "Foreshore Estate",
      "Pondy bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "T. Nagar"
    ]
  },
  {
    "busNo": "32A",
    "start": "Foreshore Estate",
    "destination": "Tollgate",
    "routeStops": "Maharani, Tondiarpet, Vallalar nagar, Broadway, Central R.S., Triplicane, V.House, AIR, Santhome",
    "areaSection": "Foreshore Estate",
    "stops": [
      "Foreshore Estate",
      "Maharani",
      "Tondiarpet",
      "Vallalar nagar",
      "Broadway",
      "Chennai Central.",
      "Triplicane",
      "V.House",
      "AIR",
      "Santhome",
      "Tollgate"
    ]
  },
  {
    "busNo": "55B",
    "start": "Guduvanch erry",
    "destination": "Pazhanthandalam",
    "routeStops": "Oorapakkam, Vandalur Zoo, Perugalathur, Tambaram,Kannadapalayam",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch erry",
      "Oorapakkam",
      "Vandalur Zoo",
      "Perugalathur",
      "Tambaram",
      "Kannadapalayam",
      "Pazhanthandalam"
    ]
  },
  {
    "busNo": "E18",
    "start": "Guduvanch ery",
    "destination": "High Court",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Tambaram, Vandalur Zoo",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo",
      "High Court"
    ]
  },
  {
    "busNo": "G18",
    "start": "Guduvanch ery",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Guindy, Pallavaram, Chromepet, Tambaram, Vandalur Zoo",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "T.Nagar"
    ]
  },
  {
    "busNo": "M18",
    "start": "Guduvanch ery",
    "destination": "Tambaram",
    "routeStops": "Vandalur Zoo/Arignar Anna Zoological Park",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Vandalur Zoo/Arignar Anna Zoological Park",
      "Tambaram"
    ]
  },
  {
    "busNo": "M18N",
    "start": "Guduvanch ery",
    "destination": "Nanganallur",
    "routeStops": "Pazhavanthangal, Pallavaram, Chromepet, Tambaram, Vandalur Zoo, Oorapakkam",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Pazhavanthangal",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Oorapakkam",
      "Nanganallur"
    ]
  },
  {
    "busNo": "T51S",
    "start": "Guduvanch ery",
    "destination": "Okkiam Thoraippakkam",
    "routeStops": "Vandalur, Tambaram East, Camp Road, Medavakkam, Sholinganallur",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Vandalur",
      "Tambaram East",
      "Camp Road",
      "Medavakkam",
      "Sholinganallur",
      "Okkiam Thoraippakkam"
    ]
  },
  {
    "busNo": "555G",
    "start": "Guduvanch ery",
    "destination": "Kelambakkam",
    "routeStops": "Urapakkam, Vandalur, Mambakkam",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Urapakkam",
      "Vandalur",
      "Mambakkam",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "21J",
    "start": "Guduvanch ery",
    "destination": "Velachery",
    "routeStops": "Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road, Poondi Bazar, Tambaram Sanatorium, Tambaram West, Vandalur",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Poondi Bazar",
      "Tambaram Sanatorium",
      "Tambaram West",
      "Vandalur",
      "Velachery"
    ]
  },
  {
    "busNo": "V21",
    "start": "Guduvanch ery",
    "destination": "Thiruvanmiyur",
    "routeStops": "SRP, Taramani, Velachery, Kamatchi Hospital, Chromepet, Tambaram",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "SRP",
      "Taramani",
      "Velachery",
      "Kamatchi Hospital",
      "Chromepet",
      "Tambaram",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "PP21",
    "start": "Guduvanch ery",
    "destination": "Broadway",
    "routeStops": "Secretariat, Chepauk, Q.M.C, Fore Shore Estate, Adyar Bus Stand, Guindy,Pallavaram, Chromepet, Tambaram, Vandalur Zoo",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Secretariat",
      "Chepauk",
      "Q.M.C",
      "Fore Shore Estate",
      "Adyar Bus Stand",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Broadway"
    ]
  },
  {
    "busNo": "M52",
    "start": "Guduvanch ery",
    "destination": "Pozhichalur",
    "routeStops": "Pallavaram,Chromepet,Tambaram, Perungalathur, Vandalor Zoo",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Perungalathur",
      "Vandalor Zoo",
      "Pozhichalur"
    ]
  },
  {
    "busNo": "70V",
    "start": "Guduvanch ery",
    "destination": "Koyambedu",
    "routeStops": "Vadapalani, Pallavaram, Tambaram",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Vadapalani",
      "Pallavaram",
      "Tambaram",
      "Koyambedu"
    ]
  },
  {
    "busNo": "G70",
    "start": "Guduvanch ery",
    "destination": "Vadapalani",
    "routeStops": "Udhayam Theater, Pallavaram, Tambaram, Vandalur Zoo",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Udhayam Theater",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo",
      "Vadapalani"
    ]
  },
  {
    "busNo": "118P",
    "start": "Guduvanch ery",
    "destination": "Puzhuthivakkam",
    "routeStops": "Aadambakkam, Guindy,Pallavaram, Tambaram, Zoo",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "Aadambakkam",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Zoo",
      "Puzhuthivakkam"
    ]
  },
  {
    "busNo": "170K",
    "start": "Guduvanch ery",
    "destination": "Ambattur O.T",
    "routeStops": "V.Z00, Tambaram, Pallavaram, Guindy, Udhayam, Vadapalani, CMBT, Anna Nagar, Padi, Ambattur I.E",
    "areaSection": "Guduvancherry",
    "stops": [
      "Guduvanch ery",
      "V.Z00",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Udhayam",
      "Vadapalani",
      "CMBT",
      "Anna Nagar",
      "Padi",
      "Ambattur I.E",
      "Ambattur O.T"
    ]
  },
  {
    "busNo": "119G",
    "start": "Guindy",
    "destination": "Kelambakkam",
    "routeStops": "Velachery, Navalur",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Velachery",
      "Navalur",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "J170",
    "start": "Guindy",
    "destination": "CMBT",
    "routeStops": "Ashok pillar, K.K.Nagar BS, MGR nagar, Nesapakkam, West K.K.nagar, Avichi School, Virugambakkam, Chinmaya Nagar, Koyambedu Market",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Ashok pillar",
      "K.K.Nagar BS",
      "MGR nagar",
      "Nesapakkam",
      "West K.K.nagar",
      "Avichi School",
      "Virugambakkam",
      "Chinmaya Nagar",
      "Koyambedu Market",
      "CMBT"
    ]
  },
  {
    "busNo": "18",
    "start": "Guindy",
    "destination": "Broadway",
    "routeStops": "Central R.S, Zimson, Shanthi Theater, LIC, TVS, Thousand Lights, DMS, Vanavil, SIET, Defence Accounts office, Nandanam, Saidapet",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Chennai Central",
      "Zimson",
      "Shanthi Theater",
      "LIC",
      "TVS",
      "Thousand Lights",
      "DMS",
      "Vanavil",
      "SIET",
      "Defence Accounts office",
      "Nandanam",
      "Saidapet",
      "Broadway"
    ]
  },
  {
    "busNo": "18F",
    "start": "Guindy",
    "destination": "Broadway",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Nandanam, CIT Nagar, Srinivasa, Mettupalayam, Saidapet West",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Nandanam",
      "CIT Nagar",
      "Srinivasa",
      "Mettupalayam",
      "Saidapet West",
      "Broadway"
    ]
  },
  {
    "busNo": "M21G",
    "start": "Guindy",
    "destination": "Broadway",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Sanskrit College, Luz, Mylapore, Mandaveli BS, Adyar Gate, Kotturpuram, Anna university,",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Sanskrit College",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "Adyar Gate",
      "Kotturpuram",
      "Anna university",
      "Broadway"
    ]
  },
  {
    "busNo": "45B",
    "start": "Guindy",
    "destination": "Anna Square",
    "routeStops": "Saidapet, Nandanam, Teynampet, Alwarpet, Luz, Chennai Citi Centre",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Saidapet",
      "Nandanam",
      "Teynampet",
      "Alwarpet",
      "Luz",
      "Chennai Citi Centre",
      "Anna Square"
    ]
  },
  {
    "busNo": "45G",
    "start": "Guindy",
    "destination": "Anna square",
    "routeStops": "Marina Beach, Chennai Citi Centre, Mylapore, Mandaveli, Adyar G ate, Nandanam, CIT Nagar, Srinivasa, Mettupalayam, Saidapet West",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Marina Beach",
      "Chennai Citi Centre",
      "Mylapore",
      "Mandaveli",
      "Adyar G ate",
      "Nandanam",
      "CIT Nagar",
      "Srinivasa",
      "Mettupalayam",
      "Saidapet West",
      "Anna square"
    ]
  },
  {
    "busNo": "M70D",
    "start": "Guindy",
    "destination": "Elango Nagar (Collector Nagar)",
    "routeStops": "Thirumangalam, CMBT, Vadapalani, Ashok Pillar",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Elango Nagar (Collector Nagar)"
    ]
  },
  {
    "busNo": "M119",
    "start": "Guindy",
    "destination": "Semmencheri",
    "routeStops": "Velachery,SRP,Perungudi",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Velachery",
      "SRP",
      "Perungudi",
      "Semmencheri"
    ]
  },
  {
    "busNo": "M119B",
    "start": "Guindy",
    "destination": "Semmencheri",
    "routeStops": "Saidapet,GandhiMandapam, Adyar,Thi ruvanmiyur",
    "areaSection": "Guindy",
    "stops": [
      "Guindy",
      "Saidapet",
      "GandhiMandapam",
      "Adyar",
      "Thi ruvanmiyur",
      "Semmencheri"
    ]
  },
  {
    "busNo": "B70",
    "start": "Guindy Estate",
    "destination": "Pattabiram",
    "routeStops": "Avadi, Ambattur OT, Padi, CMBT, Vadapalani, Udhayam, CIPET",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy Estate",
      "Avadi",
      "Ambattur OT",
      "Padi",
      "CMBT",
      "Vadapalani",
      "Udhayam",
      "CIPET",
      "Pattabiram"
    ]
  },
  {
    "busNo": "C70",
    "start": "Guindy Estate",
    "destination": "Red Hills",
    "routeStops": "Ashok nagar, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Padi, Thathankuppam, Kolathur, Retteri, Puzhal, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy Estate",
      "Ashok nagar",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Padi",
      "Thathankuppam",
      "Kolathur",
      "Retteri",
      "Puzhal",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills"
    ]
  },
  {
    "busNo": "C70xt",
    "start": "Guindy Estate",
    "destination": "Padiyanallur",
    "routeStops": "Ashok nagar, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Padi, Thathankuppam, Kolathur, Retteri, Puzhal, Kavangarai, Ayurveda Ashramam, Red Hills",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy Estate",
      "Ashok nagar",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Padi",
      "Thathankuppam",
      "Kolathur",
      "Retteri",
      "Puzhal",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills",
      "Padiyanallur"
    ]
  },
  {
    "busNo": "170C",
    "start": "Guindy Estate",
    "destination": "TVK Nagar",
    "routeStops": "Kolathur, Retteri, Thirumangalam, CMBT, Vadapalani, Ashok Pillar",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy Estate",
      "Kolathur",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "TVK Nagar"
    ]
  },
  {
    "busNo": "170C xt",
    "start": "Guindy Estate",
    "destination": "Manali",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, TVK Nagar, Retteri, Thirumangalam, CMBT, Vadapalani",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy Estate",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "TVK Nagar",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Manali"
    ]
  },
  {
    "busNo": "F70",
    "start": "Guindy TV K Estate",
    "destination": "Pattabiram",
    "routeStops": "Avadi, Ambattur I.E, Lucas, Anna Nagar West, Koyambedu market, CMBT, Vadapalani, West Saidapet",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy TV K Estate",
      "Avadi",
      "Ambattur I.E",
      "Lucas",
      "Anna Nagar West",
      "Koyambedu market",
      "CMBT",
      "Vadapalani",
      "West Saidapet",
      "Pattabiram"
    ]
  },
  {
    "busNo": "J70",
    "start": "Guindy I.E",
    "destination": "Mogappair West",
    "routeStops": "Collector Nagar, CMBT, Vadapalani, Udhayam Theater",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy I.E",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Udhayam Theater",
      "Mogappair West"
    ]
  },
  {
    "busNo": "M70V",
    "start": "Guindy TVK Estate",
    "destination": "Ambattur I.E",
    "routeStops": "Collector Nagar, Vadapalani",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy TVK Estate",
      "Collector Nagar",
      "Vadapalani",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "170D",
    "start": "Guindy Estate",
    "destination": "Kannadasan Nagar",
    "routeStops": "Moolakadai, Retteri, Thirumangalam, CMBT, Vadapalani,Ashok Pillar, Ekkattuthangal",
    "areaSection": "Guindy Estate",
    "stops": [
      "Guindy Estate",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Ekkattuthangal",
      "Kannadasan Nagar"
    ]
  },
  {
    "busNo": "52B",
    "start": "Hasthinapu ram",
    "destination": "Highcourt",
    "routeStops": "Chromepet,Pallavaram, Guindy, Saidap et, DMS, TVS, LIC, Central RS",
    "areaSection": "Hasthinapuram",
    "stops": [
      "Hasthinapu ram",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidap et",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Highcourt"
    ]
  },
  {
    "busNo": "52C",
    "start": "Hasthinapu ram",
    "destination": "T.Nagar",
    "routeStops": "Chromepet,Pallavaram, Guindy, Saidap et",
    "areaSection": "Hasthinapuram",
    "stops": [
      "Hasthinapu ram",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidap et",
      "T.Nagar"
    ]
  },
  {
    "busNo": "66A",
    "start": "Hasthinapu ram",
    "destination": "Kundrathur",
    "routeStops": "Anakaputhur, Pammal, Pallavaram, Chromepet",
    "areaSection": "Hasthinapuram",
    "stops": [
      "Hasthinapu ram",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Kundrathur"
    ]
  },
  {
    "busNo": "152B",
    "start": "Hasthinapu ram",
    "destination": "High Court",
    "routeStops": "Chromepet, Pallavaram, Guindy, Adayar B.S, Mandaveli, Mylapore, LUZ, QMC, V.House, Secretariat",
    "areaSection": "Hasthinapuram",
    "stops": [
      "Hasthinapu ram",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Adayar B.S",
      "Mandaveli",
      "Mylapore",
      "LUZ",
      "QMC",
      "V.House",
      "Secretariat",
      "High Court"
    ]
  },
  {
    "busNo": "M18G",
    "start": "Hasthinapu ram",
    "destination": "Guduvanchery",
    "routeStops": "Chromepet, Tambaram, Vandalur Zoo",
    "areaSection": "Hasthinapuram",
    "stops": [
      "Hasthinapu ram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "500A",
    "start": "Hasthinapu ram",
    "destination": "Chengalpattu",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Tambaram Sanatorium, Nehru nagar(Chromepet), Kumaran Kundram",
    "areaSection": "Hasthinapuram",
    "stops": [
      "Hasthinapu ram",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Tambaram Sanatorium",
      "Nehru nagar(Chromepet)",
      "Kumaran Kundram",
      "Chengalpattu"
    ]
  },
  {
    "busNo": "3A",
    "start": "High Court",
    "destination": "Mandaveli",
    "routeStops": "Mylapore, Luz, Alwarpet, Royapetah, L.I.C, Central",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Mylapore",
      "Luz",
      "Alwarpet",
      "Royapetah",
      "L.I.C",
      "Central",
      "Mandaveli"
    ]
  },
  {
    "busNo": "8B",
    "start": "High Court",
    "destination": "T.V.K Nagar",
    "routeStops": "Parrys, V.Nagar, Puliantope, Pattalam, Jamalaya, Venus",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Parrys",
      "V.Nagar",
      "Puliantope",
      "Pattalam",
      "Jamalaya",
      "Venus",
      "T.V.K Nagar"
    ]
  },
  {
    "busNo": "11G",
    "start": "High Court",
    "destination": "K K Nagar",
    "routeStops": "MGR Nagar, Ashok Pillar,Pangal Park, Annasalai, Central R.S, Parry's Corner",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "MGR Nagar",
      "Ashok Pillar",
      "Pangal Park",
      "Annasalai",
      "Chennai Central",
      "Parry's Corner",
      "K K Nagar"
    ]
  },
  {
    "busNo": "11H",
    "start": "High Court",
    "destination": "Iyyapanthangal",
    "routeStops": "Virugambakkam, K.K.Nagar, Pondy Bazaar, Anna Salai, Marina Beach",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Virugambakkam",
      "K.K.Nagar",
      "Pondy Bazaar",
      "Anna Salai",
      "Marina Beach",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "M12",
    "start": "High Court",
    "destination": "Kilkattalai",
    "routeStops": "Gopalapuram, Teynampet, Velachery",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Gopalapuram",
      "Teynampet",
      "Velachery",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "51P",
    "start": "High Court",
    "destination": "Puzhudivakkam BS",
    "routeStops": "Gunidy Race Course",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Gunidy Race Course",
      "Puzhudivakkam BS"
    ]
  },
  {
    "busNo": "D51",
    "start": "High Court",
    "destination": "Medavakkam koot road",
    "routeStops": "Medavakkam, Pallikkaranai, Velachery, Guindy Race Course, DMS, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "DMS",
      "LIC",
      "Chennai Central",
      "Medavakkam koot road"
    ]
  },
  {
    "busNo": "D51 xt",
    "start": "High Court",
    "destination": "SithalapakkamT NHB Colony",
    "routeStops": "Sithalapakkam Koot road, Medavakkam, Pallikkaranai, Velachery, Guindy Race Course, DMS, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Sithalapakkam Koot road",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "DMS",
      "LIC",
      "Chennai Central",
      "SithalapakkamT NHB Colony"
    ]
  },
  {
    "busNo": "E51",
    "start": "High Court",
    "destination": "Ottiambakkam",
    "routeStops": "Arasan kazhani, Sithalapakkam, Sithalapakkam Koot road, Medavakkam, Pallikkaranai, Velachery,Guindy Race Course, DMS, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Arasan kazhani",
      "Sithalapakkam",
      "Sithalapakkam Koot road",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "DMS",
      "LIC",
      "Chennai Central",
      "Ottiambakkam"
    ]
  },
  {
    "busNo": "PP51",
    "start": "High Court",
    "destination": "Tambaram East",
    "routeStops": "Selaiyur, Camp Road, Medavakkam, Pallikaranai, Velachery, Anna University, Adyar, Sathyastudio, MRC Nagar, Foreshore Estate, Santhome, AIR, Anna Square",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Selaiyur",
      "Camp Road",
      "Medavakkam",
      "Pallikaranai",
      "Velachery",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "MRC Nagar",
      "Foreshore Estate",
      "Santhome",
      "AIR",
      "Anna Square",
      "Tambaram East"
    ]
  },
  {
    "busNo": "PP51 cut",
    "start": "High Court",
    "destination": "Padhuvancherry",
    "routeStops": "Camp Road, Medavakkam, Pallikaranai, Velachery, Anna University, Adyar, Sathyastudio, MRC Nagar, Foreshore Estate, Santhome, AIR, Anna Square",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Camp Road",
      "Medavakkam",
      "Pallikaranai",
      "Velachery",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "MRC Nagar",
      "Foreshore Estate",
      "Santhome",
      "AIR",
      "Anna Square",
      "Padhuvancherry"
    ]
  },
  {
    "busNo": "52E",
    "start": "High Court",
    "destination": "Nemilicheri",
    "routeStops": "Chromepet, Pallavaram, Guindy, Saidapet, DMS, TVS, LIC, Central RS",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Nemilicheri"
    ]
  },
  {
    "busNo": "52G",
    "start": "High Court",
    "destination": "Cowl Bazaar",
    "routeStops": "Pallavaram, Guindy, Saidapet, DMS, TVS, LIC, Central RS",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Cowl Bazaar"
    ]
  },
  {
    "busNo": "52K",
    "start": "High Court",
    "destination": "Keelkattalai",
    "routeStops": "Nanganallur, Aasargana, Guindy,Anna Salai",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Nanganallur",
      "Aasargana",
      "Guindy",
      "Anna Salai",
      "Keelkattalai"
    ]
  },
  {
    "busNo": "52L",
    "start": "High Court",
    "destination": "Nanganallur",
    "routeStops": "Aasargana, Guindy,Anna Salai",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Aasargana",
      "Guindy",
      "Anna Salai",
      "Nanganallur"
    ]
  },
  {
    "busNo": "54L",
    "start": "High Court",
    "destination": "Vellavedu",
    "routeStops": "Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet, DMS, TVS, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Vellavedu"
    ]
  },
  {
    "busNo": "54M",
    "start": "High Court",
    "destination": "Mangadu",
    "routeStops": "Paraniputhur, Baikadai, Moulivakkam, Porur, Guindy, Saidapet, DMS, TVS, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Paraniputhur",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Mangadu"
    ]
  },
  {
    "busNo": "54T",
    "start": "High Court",
    "destination": "Chembarambak kam",
    "routeStops": "Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet, DMS, TVS, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Chembarambak kam"
    ]
  },
  {
    "busNo": "57F",
    "start": "High Court",
    "destination": "Karanodai",
    "routeStops": "Beach R.S, Stanley, Mint, Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red hills",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Chennai Beach",
      "Stanley",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red hills",
      "Karanodai"
    ]
  },
  {
    "busNo": "A57",
    "start": "High Court",
    "destination": "Padiyanallur",
    "routeStops": "Beach R.S, Stanley, Mint, Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red hills",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Chennai Beach",
      "Stanley",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red hills",
      "Padiyanallur"
    ]
  },
  {
    "busNo": "88A",
    "start": "High Court",
    "destination": "Nandambakkam",
    "routeStops": "Sirukalathur, Kundrathur,Koovoor,Peri yapannicherry,Baikadai,Porur, Valasara wakkam, Virugambakkam, Vadapalani, Liberty, Gemini, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Sirukalathur",
      "Kundrathur",
      "Koovoor",
      "Peri yapannicherry",
      "Baikadai",
      "Porur",
      "Valasara wakkam",
      "Virugambakkam",
      "Vadapalani",
      "Liberty",
      "Gemini",
      "LIC",
      "Chennai Central",
      "Nandambakkam"
    ]
  },
  {
    "busNo": "88R",
    "start": "High Court",
    "destination": "Amarambedu",
    "routeStops": "Gunidy, Porur, Kundrathur, Somangalam",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Gunidy",
      "Porur",
      "Kundrathur",
      "Somangalam",
      "Amarambedu"
    ]
  },
  {
    "busNo": "88M",
    "start": "High Court",
    "destination": "Somangalam",
    "routeStops": "Gunidy, Porur, Kundrathur",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Gunidy",
      "Porur",
      "Kundrathur",
      "Somangalam"
    ]
  },
  {
    "busNo": "118A",
    "start": "HighCourt",
    "destination": "Oonamancheri",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Tambaram, Vandalur Zoo, Kolapakkam, U.Mandaveli",
    "areaSection": "High Court",
    "stops": [
      "HighCourt",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo",
      "Kolapakkam",
      "U.Mandaveli",
      "Oonamancheri"
    ]
  },
  {
    "busNo": "151",
    "start": "High Court",
    "destination": "Vengaivasal P.H. Centre",
    "routeStops": "Secretariat, Marina Beach, Santhome, Adyar, Anna university, Velachery, Pallikkaranai, Medavakkam, Kamarajapuram, Rajakeelpakkam, Madambakkam",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Secretariat",
      "Marina Beach",
      "Santhome",
      "Adyar",
      "Anna university",
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Rajakeelpakkam",
      "Madambakkam",
      "Vengaivasal P.H. Centre"
    ]
  },
  {
    "busNo": "254",
    "start": "High Court",
    "destination": "Iyyapanthangal",
    "routeStops": "SRMC, Porur, Ramapuram, Guindy, Saidapet, SIET, DMS, TVS, LIC, Central R.S.",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "SRMC",
      "Porur",
      "Ramapuram",
      "Guindy",
      "Saidapet",
      "SIET",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central.",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "500B",
    "start": "High Court",
    "destination": "S.P.KOIL",
    "routeStops": "Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Pallavaram, Guindy, Saidapet, DMS, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "Chennai Central",
      "S.P.KOIL"
    ]
  },
  {
    "busNo": "A18",
    "start": "High Court",
    "destination": "Vandalur Zoo",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Chromepet, Tambaram",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "E18",
    "start": "High Court",
    "destination": "Guduvanchery",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Tambaram, Vandalur Zoo",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "E18 xt",
    "start": "High Court",
    "destination": "Maraimalai nagar",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Tambaram, Vandalur Zoo, Guduvanchery",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery",
      "Maraimalai nagar"
    ]
  },
  {
    "busNo": "A51",
    "start": "High Court",
    "destination": "Tambaram East",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Pallikkaranai, Velachery, Guindy Race Course, DMS, LIC, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "DMS",
      "LIC",
      "Chennai Central",
      "Tambaram East"
    ]
  },
  {
    "busNo": "60A",
    "start": "High Court",
    "destination": "Kundrathur Mu rugan Temple",
    "routeStops": "Kundrathur, Andankuppam, Anakaputhur, Pammal, Pallavaram, Guindy, Little Mount, Saidapet, Teynampet, DMS, TVS, Simpson, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Kundrathur",
      "Andankuppam",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Guindy",
      "Little Mount",
      "Saidapet",
      "Teynampet",
      "DMS",
      "TVS",
      "Simpson",
      "Chennai Central",
      "Kundrathur Mu rugan Temple"
    ]
  },
  {
    "busNo": "88C",
    "start": "High Court",
    "destination": "Kundrathur",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, DMS, TVS, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "Chennai Central",
      "Kundrathur"
    ]
  },
  {
    "busNo": "88C",
    "start": "High Court",
    "destination": "Thandalam",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, DMS, TVS, Central R.S",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "Chennai Central",
      "Thandalam"
    ]
  },
  {
    "busNo": "152B",
    "start": "High Court",
    "destination": "Hasthinapuram",
    "routeStops": "Chromepet, Pallavaram, Guindy, Adayar B.S, Mandaveli, Mylapore, LUZ, QMC, V.House, Secretariat",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Adayar B.S",
      "Mandaveli",
      "Mylapore",
      "LUZ",
      "QMC",
      "V.House",
      "Secretariat",
      "Hasthinapuram"
    ]
  },
  {
    "busNo": "188C",
    "start": "High Court",
    "destination": "Kundrathur",
    "routeStops": "Koovoor, Periyapannicherry, Kolapakkam, Manapakkam, Nandambakkam,Butt road, Kathipara, GuindyI.E, Little Mount, Saidapet, DMS, LIC,Central Railway Station",
    "areaSection": "High Court",
    "stops": [
      "High Court",
      "Koovoor",
      "Periyapannicherry",
      "Kolapakkam",
      "Manapakkam",
      "Nandambakkam",
      "Butt road",
      "Kathipara",
      "GuindyI.E",
      "Little Mount",
      "Saidapet",
      "DMS",
      "LIC",
      "Central Railway Station",
      "Kundrathur"
    ]
  },
  {
    "busNo": "52B",
    "start": "Highcourt",
    "destination": "Hasthinapuram",
    "routeStops": "Chromepet,Pallavaram, Guindy, Saidap et, DMS, TVS, LIC, Central RS",
    "areaSection": "High Court",
    "stops": [
      "Highcourt",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidap et",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Hasthinapuram"
    ]
  },
  {
    "busNo": "37E xt",
    "start": "Iyyapantha ngal",
    "destination": "Kaviarasu Kannadasan Nagar",
    "routeStops": "M.K.B Nagar, Vysarpadi, V Nagar,Regal,Choolai P.O.,Purasaiwakkam, Egmore,DPI, Sterling Road, Valluvarkottam, Liberty, Vadapalani, Porur, SRMC",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "M.K.B Nagar",
      "Vysarpadi",
      "V Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasaiwakkam",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Porur",
      "SRMC",
      "Kaviarasu Kannadasan Nagar"
    ]
  },
  {
    "busNo": "37G",
    "start": "Iyyapantha ngal",
    "destination": "V Nagar",
    "routeStops": "Regal, Choolai P.O., Purasaivakkam,KMC, Chetpet,Ste rling road, Valluvarkottam, Liberty, Vadapalani, Porur, SRMC",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Regal",
      "Choolai P.O.",
      "Purasaivakkam",
      "KMC",
      "Chetpet",
      "Ste rling road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Porur",
      "SRMC",
      "V Nagar"
    ]
  },
  {
    "busNo": "M89T",
    "start": "Iyyapantha ngal",
    "destination": "Amarambedu",
    "routeStops": "Porur, Kundrathur",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Porur",
      "Kundrathur",
      "Amarambedu"
    ]
  },
  {
    "busNo": "11H",
    "start": "Iyyapantha ngal",
    "destination": "High Court",
    "routeStops": "Virugambakkam, K.K.Nagar, Pondy Bazaar, Anna Salai, Marina Beach",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Virugambakkam",
      "K.K.Nagar",
      "Pondy Bazaar",
      "Anna Salai",
      "Marina Beach",
      "High Court"
    ]
  },
  {
    "busNo": "12B xt",
    "start": "Iyyapantha ngal",
    "destination": "Foreshore Estate",
    "routeStops": "Porur, Virugambakkam, Vadapalani, Liberty, Pondy Bazaar, Alwarpet, Luz, Santhome",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Porur",
      "Virugambakkam",
      "Vadapalani",
      "Liberty",
      "Pondy Bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "Foreshore Estate"
    ]
  },
  {
    "busNo": "17J",
    "start": "Iyyapantha ngal",
    "destination": "CMBT",
    "routeStops": "SRMC, Porur, Valasarawakkam, Alwarthirunagar, Virugambakkam, Chinmaya nagar, Koyambedu Market",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "SRMC",
      "Porur",
      "Valasarawakkam",
      "Alwarthirunagar",
      "Virugambakkam",
      "Chinmaya nagar",
      "Koyambedu Market",
      "CMBT"
    ]
  },
  {
    "busNo": "17M",
    "start": "Iyyapantha ngal",
    "destination": "Broadway",
    "routeStops": "Porur, Virugambakkam, Vadapalani, Kodambakkam Power house, Liberty, Periyar Road, Valluvar kottam, Gemini, Thousand lights, TVS, LIC, Simpson, Central",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Porur",
      "Virugambakkam",
      "Vadapalani",
      "Kodambakkam Power house",
      "Liberty",
      "Periyar Road",
      "Valluvar kottam",
      "Gemini",
      "Thousand lights",
      "TVS",
      "LIC",
      "Simpson",
      "Central",
      "Broadway"
    ]
  },
  {
    "busNo": "21E",
    "start": "Iyyapantha ngal",
    "destination": "Broadway",
    "routeStops": "Porur, Guindy, Adayar, Foreshore Estate, Anna Square",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Porur",
      "Guindy",
      "Adayar",
      "Foreshore Estate",
      "Anna Square",
      "Broadway"
    ]
  },
  {
    "busNo": "49",
    "start": "Iyyapantha ngal",
    "destination": "Thiruvanmiyur",
    "routeStops": "Guindy, Porur",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Guindy",
      "Porur",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "65R",
    "start": "Iyyapantha ngal",
    "destination": "Ambattur I.E",
    "routeStops": "Ambattur OT, Avadi Market, Karaiyanchavadi, Kumananchavadi",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "Ambattur OT",
      "Avadi Market",
      "Karaiyanchavadi",
      "Kumananchavadi",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "254",
    "start": "Iyyapantha ngal",
    "destination": "High Court",
    "routeStops": "SRMC, Porur, Ramapuram, Guindy, Saidapet, SIET, DMS, TVS, LIC, Central R.S.",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyapantha ngal",
      "SRMC",
      "Porur",
      "Ramapuram",
      "Guindy",
      "Saidapet",
      "SIET",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central.",
      "High Court"
    ]
  },
  {
    "busNo": "166",
    "start": "Iyyappanth angal",
    "destination": "Tambaram",
    "routeStops": "Ramachandra Hospital, Porur, Porur Powerhouse, Gerugumbakkam, Kovur, Moondram kattalai, Kundrathur, Anagaputtur, Pammal, Pallavaram, Chromepet",
    "areaSection": "Iyyappanthangal",
    "stops": [
      "Iyyappanth angal",
      "Ramachandra Hospital",
      "Porur",
      "Porur Powerhouse",
      "Gerugumbakkam",
      "Kovur",
      "Moondram kattalai",
      "Kundrathur",
      "Anagaputtur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Tambaram"
    ]
  },
  {
    "busNo": "170L",
    "start": "Kallikuppam",
    "destination": "Vandalur Zoo",
    "routeStops": "Tambaram, Pallavaram, Guindy, Vadapalani, CMBT, Anna Nagar, Padi, Ambattur I.E, Ambattur OT, Pudur",
    "areaSection": "Kallikuppam",
    "stops": [
      "Kallikuppam",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Vadapalani",
      "CMBT",
      "Anna Nagar",
      "Padi",
      "Ambattur I.E",
      "Ambattur OT",
      "Pudur",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "248A",
    "start": "Kallikuppa",
    "destination": "V Nagar",
    "routeStops": "Pudur",
    "areaSection": "Kallikuppam",
    "stops": [
      "Kallikuppa",
      "Pudur",
      "V Nagar"
    ]
  },
  {
    "busNo": "170D",
    "start": "Kannadasan Nagar",
    "destination": "Guindy Estate",
    "routeStops": "Moolakadai, Retteri, Thirumangalam, CMBT, Vadapalani,Ashok Pillar, Ekkattuthangal",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kannadasan Nagar",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Ekkattuthangal",
      "Guindy Estate"
    ]
  },
  {
    "busNo": "2A xt",
    "start": "Kaviarasu Kannadasan Nagar",
    "destination": "Anna Square",
    "routeStops": "M.K.B Nagar",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kaviarasu Kannadasan Nagar",
      "M.K.B Nagar",
      "Anna Square"
    ]
  },
  {
    "busNo": "7G",
    "start": "Kaviarasu Kannadasan Nagar",
    "destination": "Broadway",
    "routeStops": "Moolakadai, Perambur market, Pattalam, Doveton, Periamedu, Central R.S",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kaviarasu Kannadasan Nagar",
      "Moolakadai",
      "Perambur market",
      "Pattalam",
      "Doveton",
      "Periamedu",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "M33xt",
    "start": "Kaviarasu Kannadasan Nagar",
    "destination": "Broadway",
    "routeStops": "M.K.B Nagar, Vyasarpadi, Basin Bridge, Mint, Mannadi",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kaviarasu Kannadasan Nagar",
      "M.K.B Nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Mannadi",
      "Broadway"
    ]
  },
  {
    "busNo": "37E xt",
    "start": "Kaviarasu Kannadasan Nagar",
    "destination": "Iyyapanthangal",
    "routeStops": "M.K.B Nagar, Vysarpadi, V Nagar,Regal,Choolai P.O.,Purasaiwakkam, Egmore,DPI, Sterling Road, Valluvarkottam, Liberty, Vadapalani, Porur, SRMC",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kaviarasu Kannadasan Nagar",
      "M.K.B Nagar",
      "Vysarpadi",
      "V Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasaiwakkam",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Porur",
      "SRMC",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "M116",
    "start": "Kaviarasu Kannadhas an Nagar",
    "destination": "Broadway",
    "routeStops": "SIDCO, MKB Nagar, Sathyamoorthy Nagar, Basin Bridge, Mint, Stanley, Beach R.S",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kaviarasu Kannadhas an Nagar",
      "SIDCO",
      "MKB Nagar",
      "Sathyamoorthy Nagar",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Broadway"
    ]
  },
  {
    "busNo": "121G",
    "start": "Kaviarasu Kannadasan Nagar",
    "destination": "CMBT",
    "routeStops": "Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kaviarasu Kannadasan Nagar",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "CMBT"
    ]
  },
  {
    "busNo": "170T",
    "start": "Kaviarasu Kannadasan Nagar",
    "destination": "Vandalur Zoo",
    "routeStops": "MR Nagar, Moolakadai, Retteri, Thirumangalam, CMBT, Vadapalani, Guindy, Pallavaram, Tambaram",
    "areaSection": "Kannadasan Nagar",
    "stops": [
      "Kaviarasu Kannadasan Nagar",
      "MR Nagar",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "M21C",
    "start": "Kannagi Nagar",
    "destination": "Chennai Central",
    "routeStops": "Thoraipakkam, Perungudi, Thiruvanmiyur, Adayar, Mandaveli",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "Thoraipakkam",
      "Perungudi",
      "Thiruvanmiyur",
      "Adayar",
      "Mandaveli",
      "Chennai Central"
    ]
  },
  {
    "busNo": "M21F",
    "start": "Kannagi Nagar",
    "destination": "Egmore",
    "routeStops": "Mettukuppam, Perugudi, Kandan chavadi, SRP Tools, Thiruvanmiyur, Adyar, AMS, Mandaveli, Mylapore, Ajantha, Royapettah, Wesley School, LIC, Pudhupet, Maternity Hospital",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "Mettukuppam",
      "Perugudi",
      "Kandan chavadi",
      "SRP Tools",
      "Thiruvanmiyur",
      "Adyar",
      "AMS",
      "Mandaveli",
      "Mylapore",
      "Ajantha",
      "Royapettah",
      "Wesley School",
      "LIC",
      "Pudhupet",
      "Maternity Hospital",
      "Egmore"
    ]
  },
  {
    "busNo": "M21T",
    "start": "Kannagi Nagar",
    "destination": "Broadway",
    "routeStops": "Santhome, Adyar, Perungudi",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "Santhome",
      "Adyar",
      "Perungudi",
      "Broadway"
    ]
  },
  {
    "busNo": "5G",
    "start": "Kannagi Nagar",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Velachery, Taramani, RMZ, Perugudi",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "Saidapet",
      "Velachery",
      "Taramani",
      "RMZ",
      "Perugudi",
      "T. Nagar"
    ]
  },
  {
    "busNo": "M19B",
    "start": "Kannagi Nagar",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Adyar, Thiruvanmiyur, Jain College, Perungudi",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Jain College",
      "Perungudi",
      "T. Nagar"
    ]
  },
  {
    "busNo": "21F",
    "start": "Kannagi nagar",
    "destination": "Egmore",
    "routeStops": "",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi nagar",
      "Egmore"
    ]
  },
  {
    "busNo": "T21",
    "start": "Kannagi Nagar",
    "destination": "Broadway",
    "routeStops": "Thoraipakkam, Adyar, Marina",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "Thoraipakkam",
      "Adyar",
      "Marina",
      "Broadway"
    ]
  },
  {
    "busNo": "70S",
    "start": "Kannagi Nagar",
    "destination": "CMBT",
    "routeStops": "Velachery, SRP Tools",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "Velachery",
      "SRP Tools",
      "CMBT"
    ]
  },
  {
    "busNo": "M151K",
    "start": "Kannagi Nagar",
    "destination": "Tambaram East",
    "routeStops": "CampRoad, Medavakkam, Shozhinganallur, Okkiam",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannagi Nagar",
      "CampRoad",
      "Medavakkam",
      "Shozhinganallur",
      "Okkiam",
      "Tambaram East"
    ]
  },
  {
    "busNo": "T51 cut",
    "start": "Kannaki Nagar",
    "destination": "Tambaram East",
    "routeStops": "Camp Road, Medavakkam, Sholinganallur",
    "areaSection": "Kannagi Nagar",
    "stops": [
      "Kannaki Nagar",
      "Camp Road",
      "Medavakkam",
      "Sholinganallur",
      "Tambaram East"
    ]
  },
  {
    "busNo": "188K",
    "start": "Katrambak kam",
    "destination": "T.Nagar",
    "routeStops": "Kundrathur, Koovoor, Periyapannicherry,Baikadai, Moulivakkam, Porur, Manapakkam, Nandambakkam,Butt road, Kathipara, Guindy I.E, Little Mount, Saidapet",
    "areaSection": "Katrambakkam",
    "stops": [
      "Katrambak kam",
      "Kundrathur",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Manapakkam",
      "Nandambakkam",
      "Butt road",
      "Kathipara",
      "Guindy I.E",
      "Little Mount",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "219",
    "start": "Kelambakk am",
    "destination": "Ambattur I.E",
    "routeStops": "Collector Nagar, Thirumangalam, Anna Arch, Choolaimedu, Mahalingapuram, T.Nagar, Saidapet, Madhya Kailash, Tidel Park, Thoraipakkam, Siruseri",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Collector Nagar",
      "Thirumangalam",
      "Anna Arch",
      "Choolaimedu",
      "Mahalingapuram",
      "T.Nagar",
      "Saidapet",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "Siruseri",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "221H",
    "start": "Kelambakk am",
    "destination": "Chennai Central",
    "routeStops": "LIC,DMS, Saidapet,IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, Sholinganallur, SIRUSERI",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "LIC",
      "DMS",
      "Saidapet",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "Sholinganallur",
      "SIRUSERI",
      "Chennai Central"
    ]
  },
  {
    "busNo": "M5",
    "start": "Kelambakk am",
    "destination": "Adyar",
    "routeStops": "Thiruvanmiyur, Perungudi, Sholinganallur",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Thiruvanmiyur",
      "Perungudi",
      "Sholinganallur",
      "Adyar"
    ]
  },
  {
    "busNo": "19B",
    "start": "Kelambakk am",
    "destination": "Saidapet",
    "routeStops": "IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, SIRUSERI",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "SIRUSERI",
      "Saidapet"
    ]
  },
  {
    "busNo": "19P",
    "start": "Kelambakk am",
    "destination": "Adyar Bus Stand",
    "routeStops": "SRP Tools, Perugudi, Sholinganallur, Navalur, Thalambur, Sirusery, Pudupakkam, Chettinad Hospital",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "SRP Tools",
      "Perugudi",
      "Sholinganallur",
      "Navalur",
      "Thalambur",
      "Sirusery",
      "Pudupakkam",
      "Chettinad Hospital",
      "Adyar Bus Stand"
    ]
  },
  {
    "busNo": "B19",
    "start": "Kelambakk am",
    "destination": "Shozhinganallur",
    "routeStops": "Navallur, Siruseri",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Navallur",
      "Siruseri",
      "Shozhinganallur"
    ]
  },
  {
    "busNo": "M19A",
    "start": "Kelambakk am",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Adyar, Thiruvanmiyur, Perungudi",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Perungudi",
      "T. Nagar"
    ]
  },
  {
    "busNo": "21H",
    "start": "Kelambakk am",
    "destination": "Broadway",
    "routeStops": "Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Perungudi, Sholinganallur, Navalur",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Broadway"
    ]
  },
  {
    "busNo": "21H Cut",
    "start": "Kelambakk am",
    "destination": "Thiruvanmiyur",
    "routeStops": "SRP Tools,Perungudi,Sholinganallur,Navalu r,Padur",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Padur",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "21H xt",
    "start": "Kelambakk am",
    "destination": "Thiruvotriyur",
    "routeStops": "Tollgate, Broadway, Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools,Perungudi,Sholinganallur,Navalu",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Tollgate",
      "Broadway",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Navalu",
      "Thiruvotriyur"
    ]
  },
  {
    "busNo": "M51D",
    "start": "Kelambakk am",
    "destination": "Saidapet",
    "routeStops": "Velachery, Medavakkam, Ottiyambakkam, Karanai, Thalambur, Pudhupakkam, Chettinad Hospital",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Velachery",
      "Medavakkam",
      "Ottiyambakkam",
      "Karanai",
      "Thalambur",
      "Pudhupakkam",
      "Chettinad Hospital",
      "Saidapet"
    ]
  },
  {
    "busNo": "119G",
    "start": "Kelambakk am",
    "destination": "Guindy",
    "routeStops": "Velachery, Navalur",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Velachery",
      "Navalur",
      "Guindy"
    ]
  },
  {
    "busNo": "515V",
    "start": "Kelambakk am",
    "destination": "Vandalur",
    "routeStops": "Mambakkam",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Mambakkam",
      "Vandalur"
    ]
  },
  {
    "busNo": "551A",
    "start": "Kelambakk am",
    "destination": "Tambaram East",
    "routeStops": "CampRoad, Medavakkam, Ponmar, Mambakkam, Pudupakkam, Chettinad Hospital",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "CampRoad",
      "Medavakkam",
      "Ponmar",
      "Mambakkam",
      "Pudupakkam",
      "Chettinad Hospital",
      "Tambaram East"
    ]
  },
  {
    "busNo": "555G",
    "start": "Kelambakk am",
    "destination": "Guduvanchery",
    "routeStops": "Urapakkam, Vandalur, Mambakkam",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Urapakkam",
      "Vandalur",
      "Mambakkam",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "555P",
    "start": "Kelambakk am",
    "destination": "Padappai",
    "routeStops": "Karasangal, Vandalur, Mambakkam",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Karasangal",
      "Vandalur",
      "Mambakkam",
      "Padappai"
    ]
  },
  {
    "busNo": "570",
    "start": "Kelambakk am",
    "destination": "CMBT",
    "routeStops": "Vadapalani, Ashok Nagar, Guindy, Check post, Velachery, SRP tools, Perungudi, Sholinganallur, Navalur, Padur",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Check post",
      "Velachery",
      "SRP tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Padur",
      "CMBT"
    ]
  },
  {
    "busNo": "570A",
    "start": "Kelambakk am",
    "destination": "Ambattur Estate",
    "routeStops": "CMBT, Vadapalani, Ashok Nagar, Guindy, Check post, Velachery, SRP tools, Perungudi,Sholinganallur, Navalur, Padur",
    "areaSection": "Kelambakkam",
    "stops": [
      "Kelambakk am",
      "CMBT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Check post",
      "Velachery",
      "SRP tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Padur",
      "Ambattur Estate"
    ]
  },
  {
    "busNo": "572K",
    "start": "Kilanur",
    "destination": "Ambattur I.E",
    "routeStops": "Avadi, Pattabiram, Thirunindravur, Veppampattu, Sevapet",
    "areaSection": "Kilanur",
    "stops": [
      "Kilanur",
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Veppampattu",
      "Sevapet",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "M18C",
    "start": "Kilkattalai",
    "destination": "T.Nagar",
    "routeStops": "Madipakkam Koot Road, Nanganallur, Guindy, Saidapet",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Madipakkam Koot Road",
      "Nanganallur",
      "Guindy",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "66K",
    "start": "Kilkattalai",
    "destination": "Poonamallee",
    "routeStops": "Inchangadu, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Kumananchavadi, Karaiyanchavadi",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Inchangadu",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Kumananchavadi",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "70K",
    "start": "Kilkattalai",
    "destination": "CMBT",
    "routeStops": "Velachery, Guindy, Ashok Pillar, Vadapalani",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Velachery",
      "Guindy",
      "Ashok Pillar",
      "Vadapalani",
      "CMBT"
    ]
  },
  {
    "busNo": "170N",
    "start": "Kilkattalai",
    "destination": "Perambur",
    "routeStops": "Nanganallur, Guindy, Udhayam, Vadapalani, CMBT, Thirumangalam, Retteri, Venus",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Nanganallur",
      "Guindy",
      "Udhayam",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Retteri",
      "Venus",
      "Perambur"
    ]
  },
  {
    "busNo": "552K",
    "start": "Kilkattalai",
    "destination": "Thirupporur",
    "routeStops": "Medavakkam, Sholinganallur, Kelamba kkam",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Medavakkam",
      "Sholinganallur",
      "Kelamba kkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "52K",
    "start": "Keelkattalai",
    "destination": "High Court",
    "routeStops": "Nanganallur, Aasargana, Guindy,Anna Salai",
    "areaSection": "Kilkattalai",
    "stops": [
      "Keelkattalai",
      "Nanganallur",
      "Aasargana",
      "Guindy",
      "Anna Salai",
      "High Court"
    ]
  },
  {
    "busNo": "79K",
    "start": "Keelkattalai",
    "destination": "Oragadam",
    "routeStops": "Padappai, Mudichur, West Tambaram, East Tambaram, Camp Road, Kamarajapuram, Medavakkam Koot Road, Kovilambakkam",
    "areaSection": "Kilkattalai",
    "stops": [
      "Keelkattalai",
      "Padappai",
      "Mudichur",
      "West Tambaram",
      "East Tambaram",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam Koot Road",
      "Kovilambakkam",
      "Oragadam"
    ]
  },
  {
    "busNo": "M1",
    "start": "Kilkattalai",
    "destination": "Thiruvanmiyur",
    "routeStops": "SRP Tools, Velachery, Kaiveli, Ram Nagar, Madipakkam",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "SRP Tools",
      "Velachery",
      "Kaiveli",
      "Ram Nagar",
      "Madipakkam",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "M12",
    "start": "Kilkattalai",
    "destination": "High Court",
    "routeStops": "Gopalapuram, Teynampet, Velachery",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Gopalapuram",
      "Teynampet",
      "Velachery",
      "High Court"
    ]
  },
  {
    "busNo": "18D",
    "start": "Kilkattalai",
    "destination": "Broadway",
    "routeStops": "LIC, TVS, Saidapet, Guindy, St. Thomas Mount",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "St. Thomas Mount",
      "Broadway"
    ]
  },
  {
    "busNo": "21L xt",
    "start": "Kilkattalai",
    "destination": "Broadway",
    "routeStops": "Marina Beach, Foreshore Estate, MRC Nagar, Adyar, Anna University, Velachery",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Marina Beach",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "Anna University",
      "Velachery",
      "Broadway"
    ]
  },
  {
    "busNo": "M45",
    "start": "Kilkattalai",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Velachery",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Saidapet",
      "Velachery",
      "T. Nagar"
    ]
  },
  {
    "busNo": "M45E",
    "start": "Kilkattalai",
    "destination": "Anna Square",
    "routeStops": "Triplicane, Chennai Citi Centre, Luz, Saidapet, Velachery",
    "areaSection": "Kilkattalai",
    "stops": [
      "Kilkattalai",
      "Triplicane",
      "Chennai Citi Centre",
      "Luz",
      "Saidapet",
      "Velachery",
      "Anna Square"
    ]
  },
  {
    "busNo": "23C xt",
    "start": "Korattur",
    "destination": "Thiruvanmiyur",
    "routeStops": "Lucas, Nathamuni, ICF, Ayanavaram, Purasaiwakkam, Egmore, LIC, TVS, Saidapet, Adyar",
    "areaSection": "Korattur",
    "stops": [
      "Korattur",
      "Lucas",
      "Nathamuni",
      "ICF",
      "Ayanavaram",
      "Purasaiwakkam",
      "Egmore",
      "LIC",
      "TVS",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "7B",
    "start": "Korattur",
    "destination": "Broadway",
    "routeStops": "Central R.S, Periamet, Vepery, Doveton, Pattalam, Otteri, Ayanavaram, Joint Office, ICF, Villivakkam, Nathamuni",
    "areaSection": "Korattur",
    "stops": [
      "Korattur",
      "Chennai Central",
      "Periamet",
      "Vepery",
      "Doveton",
      "Pattalam",
      "Otteri",
      "Ayanavaram",
      "Joint Office",
      "ICF",
      "Villivakkam",
      "Nathamuni",
      "Broadway"
    ]
  },
  {
    "busNo": "47D cut",
    "start": "Korattur",
    "destination": "T.Nagar",
    "routeStops": "Adyar, T. Nagar, Sterling Road, Lucas",
    "areaSection": "Korattur",
    "stops": [
      "Korattur",
      "Adyar",
      "T. Nagar",
      "Sterling Road",
      "Lucas",
      "T.Nagar"
    ]
  },
  {
    "busNo": "65T",
    "start": "Korattur",
    "destination": "Poonamallee",
    "routeStops": "Pattravakkam, Ambattur OT, Avadi Market, Karaiyanchavadi",
    "areaSection": "Korattur",
    "stops": [
      "Korattur",
      "Pattravakkam",
      "Ambattur OT",
      "Avadi Market",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "B21xt",
    "start": "Korukkupet",
    "destination": "Medavakkam Koot Road",
    "routeStops": "V.Nagar, Parrys, Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Velacherry, Madipakkam Koot road, Kilkatalai, Kovilambakkam, Vellakal",
    "areaSection": "Korukkupet",
    "stops": [
      "Korukkupet",
      "V.Nagar",
      "Parrys",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Velacherry",
      "Madipakkam Koot road",
      "Kilkatalai",
      "Kovilambakkam",
      "Vellakal",
      "Medavakkam Koot Road"
    ]
  },
  {
    "busNo": "B18",
    "start": "Korukkupet",
    "destination": "Vandalur Zoo",
    "routeStops": "Broadway, LIC, TVS, Saidapet, Guindy, Pallavaram, Tambaram",
    "areaSection": "Korukkupet",
    "stops": [
      "Korukkupet",
      "Broadway",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "32B",
    "start": "Korukkupet",
    "destination": "V. House",
    "routeStops": "Vallalar nagar, Broadway, Central R.S., Simpson",
    "areaSection": "Korukkupet",
    "stops": [
      "Korukkupet",
      "Vallalar nagar",
      "Broadway",
      "Chennai Central.",
      "Simpson",
      "V. House"
    ]
  },
  {
    "busNo": "47C",
    "start": "Kotturpuram",
    "destination": "Ambattur I.E",
    "routeStops": "Saidpet, T. Nagar, Mahalingapuram, Choolaimedu, Roundtana,",
    "areaSection": "Kotturpuram",
    "stops": [
      "Kotturpuram",
      "Saidpet",
      "T. Nagar",
      "Mahalingapuram",
      "Choolaimedu",
      "Roundtana",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "70V",
    "start": "Koyambedu",
    "destination": "Guduvanchery",
    "routeStops": "Vadapalani, Pallavaram, Tambaram",
    "areaSection": "Koyambedu",
    "stops": [
      "Koyambedu",
      "Vadapalani",
      "Pallavaram",
      "Tambaram",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "L18",
    "start": "Koyambed uMarket",
    "destination": "Mudichur",
    "routeStops": "Vadapalani, Ashok pillar, Guindy, Pallavaram, Tambaram, Old Perugalathur",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambed uMarket",
      "Vadapalani",
      "Ashok pillar",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Old Perugalathur",
      "Mudichur"
    ]
  },
  {
    "busNo": "62D",
    "start": "Koyambedu Market",
    "destination": "Puzhal",
    "routeStops": "",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "Puzhal"
    ]
  },
  {
    "busNo": "62E",
    "start": "Koyambedu Market",
    "destination": "Madanakuppam",
    "routeStops": "",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "Madanakuppam"
    ]
  },
  {
    "busNo": "70C",
    "start": "Koyambedu Market",
    "destination": "Tambaram",
    "routeStops": "Vadapalani, Udhayam, Pallavaram, Tambaram",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "Vadapalani",
      "Udhayam",
      "Pallavaram",
      "Tambaram"
    ]
  },
  {
    "busNo": "70C xt",
    "start": "Koyambedu Market",
    "destination": "Mambakkam",
    "routeStops": "CMBT, Vadapalani, Ashok nagar, Guindy, Pallavaram, Tambaram, Tambaram East, Camp road, Rajakilpakkam, Kozhipannai, Madambakkam, Jothi nagar, Sithalapakkam Housing board, Kovilancherry, Madurapakkam, Ponmar, Mambakkam Kulam",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "CMBT",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Tambaram East",
      "Camp road",
      "Rajakilpakkam",
      "Kozhipannai",
      "Madambakkam",
      "Jothi nagar",
      "Sithalapakkam Housing board",
      "Kovilancherry",
      "Madurapakkam",
      "Ponmar",
      "Mambakkam Kulam",
      "Mambakkam"
    ]
  },
  {
    "busNo": "114E",
    "start": "Koyambedu market",
    "destination": "New Erumai Vettipalayam",
    "routeStops": "Red Hills, Puzhal, Nethaji Circle(byepass), Retteri",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu market",
      "Red Hills",
      "Puzhal",
      "Nethaji Circle(byepass)",
      "Retteri",
      "New Erumai Vettipalayam"
    ]
  },
  {
    "busNo": "114P",
    "start": "Koyambedu Market",
    "destination": "Padiyanallur",
    "routeStops": "Puzhal, Nethaji circle, Retteri, Lucas, Thriumangalam",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "Puzhal",
      "Nethaji circle",
      "Retteri",
      "Lucas",
      "Thriumangalam",
      "Padiyanallur"
    ]
  },
  {
    "busNo": "12B xt",
    "start": "Koyambedu Market",
    "destination": "Foreshore Estate",
    "routeStops": "CMBT, MMDA Colony, Vadapalani, Kodambakkam, Pondy Bazaar, Alwarpet, Luz, Santhome",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "CMBT",
      "MMDA Colony",
      "Vadapalani",
      "Kodambakkam",
      "Pondy Bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "Foreshore Estate"
    ]
  },
  {
    "busNo": "15F cut",
    "start": "Koyambedu Market",
    "destination": "Broadway",
    "routeStops": "CMBT, Amijikarai, KMC, Dasaprakash, Central R.S",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "CMBT",
      "Amijikarai",
      "KMC",
      "Dasaprakash",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "114 cut",
    "start": "Koyambedu Market",
    "destination": "Red Hills",
    "routeStops": "Puzhal, Nethaji Circle(byepass), Retteri, Thirumangalam",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "Puzhal",
      "Nethaji Circle(byepass)",
      "Retteri",
      "Thirumangalam",
      "Red Hills"
    ]
  },
  {
    "busNo": "159C",
    "start": "Koyambedu Market",
    "destination": "Thiruvottiyur",
    "routeStops": "Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "Koyambedu Market",
    "stops": [
      "Koyambedu Market",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "88C",
    "start": "Kundrathur",
    "destination": "High Court",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, DMS, TVS, Central R.S",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "88C cut",
    "start": "Kundrathur",
    "destination": "T.Nagar",
    "routeStops": "Sirukalathur, Kundrathur B.S, Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, DMS, TVS, Central R.S",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Sirukalathur",
      "Kundrathur B.S",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "Chennai Central",
      "T.Nagar"
    ]
  },
  {
    "busNo": "88D",
    "start": "Kundrathur",
    "destination": "Saidapet West",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, Srinivasa Theater",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "Srinivasa Theater",
      "Saidapet West"
    ]
  },
  {
    "busNo": "88E",
    "start": "Kundrathur",
    "destination": "Ekkadttuthangal",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Ekkadttuthangal"
    ]
  },
  {
    "busNo": "M88",
    "start": "Kundrathur",
    "destination": "Vadapalani",
    "routeStops": "Porur",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Porur",
      "Vadapalani"
    ]
  },
  {
    "busNo": "188C",
    "start": "Kundrathur",
    "destination": "High Court",
    "routeStops": "Koovoor, Periyapannicherry, Kolapakkam, Manapakkam, Nandambakkam,Butt road, Kathipara, GuindyI.E, Little Mount, Saidapet, DMS, LIC,Central Railway Station",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Koovoor",
      "Periyapannicherry",
      "Kolapakkam",
      "Manapakkam",
      "Nandambakkam",
      "Butt road",
      "Kathipara",
      "GuindyI.E",
      "Little Mount",
      "Saidapet",
      "DMS",
      "LIC",
      "Central Railway Station",
      "High Court"
    ]
  },
  {
    "busNo": "566",
    "start": "Kundrathur",
    "destination": "Thirupporur",
    "routeStops": "Anakaputhur, Pammal, Pallavaram, Chromepet, Tambaram Sanatorium, Tambaram, Vandalur, Kandigai, Mambakkam, Pudhupakkam, Chettinad Hospital, Kelambakkam",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Tambaram Sanatorium",
      "Tambaram",
      "Vandalur",
      "Kandigai",
      "Mambakkam",
      "Pudhupakkam",
      "Chettinad Hospital",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "60E",
    "start": "Kundrathur",
    "destination": "Broadway",
    "routeStops": "Andankuppam, Anakaputtur, Pallavaram, Guindy, Anna University, Adyar, Sathyastudio, MRC Nagar, Pattinapakkam, AIR, Kannagi Statue, Annasquare",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Andankuppam",
      "Anakaputtur",
      "Pallavaram",
      "Guindy",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "MRC Nagar",
      "Pattinapakkam",
      "AIR",
      "Kannagi Statue",
      "Annasquare",
      "Broadway"
    ]
  },
  {
    "busNo": "66A",
    "start": "Kundrathur",
    "destination": "Hasthinapuram",
    "routeStops": "Anakaputhur, Pammal, Pallavaram, Chromepet",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Hasthinapuram"
    ]
  },
  {
    "busNo": "578",
    "start": "Kundrathur",
    "destination": "Sriperumbudur",
    "routeStops": "Mangadu, Kumananchavadi, Poonamallee, Chembarambakkam, Irrungattukottai",
    "areaSection": "Kundrathur",
    "stops": [
      "Kundrathur",
      "Mangadu",
      "Kumananchavadi",
      "Poonamallee",
      "Chembarambakkam",
      "Irrungattukottai",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "60A",
    "start": "Kundrathur Murugan Temple",
    "destination": "High Court",
    "routeStops": "Kundrathur, Andankuppam, Anakaputhur, Pammal, Pallavaram, Guindy, Little Mount, Saidapet, Teynampet, DMS, TVS, Simpson, Central R.S",
    "areaSection": "Kundrathur Murugan Temple",
    "stops": [
      "Kundrathur Murugan Temple",
      "Kundrathur",
      "Andankuppam",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Guindy",
      "Little Mount",
      "Saidapet",
      "Teynampet",
      "DMS",
      "TVS",
      "Simpson",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "T553",
    "start": "Kunnam",
    "destination": "Thiruverkadu",
    "routeStops": "Kumananchavadi, Poonamallee, Irrungattukottai, Sriperumbudur, Sung uvarchatiram",
    "areaSection": "Kunnam",
    "stops": [
      "Kunnam",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur",
      "Sung uvarchatiram",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "54G",
    "start": "Kuthambak kam",
    "destination": "Broadway",
    "routeStops": "Vellavedu, Thirumazhisai, Poonamallee, Porur, Guindy, DMS, TVS, LIC, Central R.S",
    "areaSection": "Kuthambakkam",
    "stops": [
      "Kuthambak kam",
      "Vellavedu",
      "Thirumazhisai",
      "Poonamallee",
      "Porur",
      "Guindy",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "11A xt",
    "start": "M.K.B Nagar East",
    "destination": "T.Nagar",
    "routeStops": "Annasalai, Central R.S, Parry's Corner, Stanley Hospital, Vallalar nagar, Vysarpadi",
    "areaSection": "MKB Nagar",
    "stops": [
      "M.K.B Nagar East",
      "Annasalai",
      "Chennai Central",
      "Parry's Corner",
      "Stanley Hospital",
      "Vallalar nagar",
      "Vysarpadi",
      "T.Nagar"
    ]
  },
  {
    "busNo": "37E",
    "start": "M.K.B Nagar",
    "destination": "Vadapalani",
    "routeStops": "Vysarpadi, V Nagar,Regal,Choolai P.O.,Purasaiwakkam, Egmore,DPI, Sterling Road, Valluvarkottam, Liberty",
    "areaSection": "MKB Nagar",
    "stops": [
      "M.K.B Nagar",
      "Vysarpadi",
      "V Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasaiwakkam",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani"
    ]
  },
  {
    "busNo": "170S",
    "start": "MKB Nagar East",
    "destination": "CMBT",
    "routeStops": "Sarma Nagar, Moolakadai, Retteri, Thirumangalam, DMDK Office",
    "areaSection": "MKB Nagar",
    "stops": [
      "MKB Nagar East",
      "Sarma Nagar",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "DMDK Office",
      "CMBT"
    ]
  },
  {
    "busNo": "2A",
    "start": "M.K.B Nagar",
    "destination": "Anna Square",
    "routeStops": "Vyasarpadi, Basin Bridge, Regal, Elephant gate, Central R.S, P R & sons, Walaja Road, Bells Road",
    "areaSection": "MKB Nagar",
    "stops": [
      "M.K.B Nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Regal",
      "Elephant gate",
      "Chennai Central",
      "P R & sons",
      "Walaja Road",
      "Bells Road",
      "Anna Square"
    ]
  },
  {
    "busNo": "33",
    "start": "M.K.B Nagar",
    "destination": "Broadway",
    "routeStops": "Vyasarpadi, Basin Bridge, Mint, Mannadi",
    "areaSection": "MKB Nagar",
    "stops": [
      "M.K.B Nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Mannadi",
      "Broadway"
    ]
  },
  {
    "busNo": "29J",
    "start": "Madhavaram",
    "destination": "Mandaveli",
    "routeStops": "Moolakadai, Perambur, Jamaliya, Otteri, KMC, Chetpet, Sterling Road/College Road, Gemini, Mylapore",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Moolakadai",
      "Perambur",
      "Jamaliya",
      "Otteri",
      "KMC",
      "Chetpet",
      "Sterling Road/College Road",
      "Gemini",
      "Mylapore",
      "Mandaveli"
    ]
  },
  {
    "busNo": "38H",
    "start": "Madhavaram",
    "destination": "Broadway",
    "routeStops": "Thapal Petti, Moolakadai, Sharma nagar, Vyasarpadi, Basin Bridge, Mint, Stanley, Beach R.S",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Thapal Petti",
      "Moolakadai",
      "Sharma nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Broadway"
    ]
  },
  {
    "busNo": "38J",
    "start": "Madhavaram",
    "destination": "T.Nagar",
    "routeStops": "Thapal Petti, Moolakadai, Sharma nagar, Vyasarpadi, Basin Bridge, Mint, Stanley, Beach R.S, Broadway, Central, LIC, TVS, DMS, Panagal Park",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Thapal Petti",
      "Moolakadai",
      "Sharma nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Broadway",
      "Central",
      "LIC",
      "TVS",
      "DMS",
      "Panagal Park",
      "T.Nagar"
    ]
  },
  {
    "busNo": "48A",
    "start": "Madhavaram",
    "destination": "Ambattur I.E",
    "routeStops": "Moolakadai, Perambur, Ayanavaram, ICF, Villivakkam, Padi",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Moolakadai",
      "Perambur",
      "Ayanavaram",
      "ICF",
      "Villivakkam",
      "Padi",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "162",
    "start": "Madhavaram",
    "destination": "Poonamallee",
    "routeStops": "Koyambedu Junction, Mathuravoyal, Kumananchavadi, Karaiyanchavadi",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Koyambedu Junction",
      "Mathuravoyal",
      "Kumananchavadi",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "170A",
    "start": "Madhavaram",
    "destination": "Vandalur Zoo",
    "routeStops": "Thapal petti, Moolakadai, Retteri, Thirumangalam, CMBT, Vadapalani, Guindy, Pallavaram, Tambaram",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "56T",
    "start": "Madhavaram",
    "destination": "Tiruvottiyur",
    "routeStops": "MFL",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "MFL",
      "Tiruvottiyur"
    ]
  },
  {
    "busNo": "56W",
    "start": "Madhavaram",
    "destination": "V Nagar",
    "routeStops": "Tondiarpet, Thiruvottriyur, MFL",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Tondiarpet",
      "Thiruvottriyur",
      "MFL",
      "V Nagar"
    ]
  },
  {
    "busNo": "147",
    "start": "Madhavaram",
    "destination": "T.Nagar",
    "routeStops": "Moolakadai, Retteri, Thirumangalam, Rountana, Loyola College, Mahalingapuram, Panagal park",
    "areaSection": "Madhavaram",
    "stops": [
      "Madhavaram",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "Rountana",
      "Loyola College",
      "Mahalingapuram",
      "Panagal park",
      "T.Nagar"
    ]
  },
  {
    "busNo": "588",
    "start": "Mamallapu ram",
    "destination": "Adyar",
    "routeStops": "Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "Adyar"
    ]
  },
  {
    "busNo": "588B",
    "start": "Mamallapu ram",
    "destination": "Broadway",
    "routeStops": "Marina Beach, Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Marina Beach",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "Broadway"
    ]
  },
  {
    "busNo": "588C",
    "start": "Mamallapu ram",
    "destination": "CMBT",
    "routeStops": "Vadapalani, Ashok Nagar, Guindy, Adyar, Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Adyar",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "CMBT"
    ]
  },
  {
    "busNo": "589",
    "start": "Mamallapu ram",
    "destination": "Velachery",
    "routeStops": "Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "Velachery"
    ]
  },
  {
    "busNo": "515",
    "start": "Mamallapu ram",
    "destination": "Tambaram",
    "routeStops": "Vandalur Zoo, Kolapakkam, Vengambakkam, Rathinamangalam, Kandigai, Melkottaiyur, Kilkottaiyur, Mambakkam, Pudhupakkam, Kelambakkam, Kalavakkam, Thirupporur, Thandalam, Paiyanoor",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Vandalur Zoo",
      "Kolapakkam",
      "Vengambakkam",
      "Rathinamangalam",
      "Kandigai",
      "Melkottaiyur",
      "Kilkottaiyur",
      "Mambakkam",
      "Pudhupakkam",
      "Kelambakkam",
      "Kalavakkam",
      "Thirupporur",
      "Thandalam",
      "Paiyanoor",
      "Tambaram"
    ]
  },
  {
    "busNo": "568",
    "start": "Mamallapu ram",
    "destination": "Adyar",
    "routeStops": "Rajiv Gandhi Salai",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Rajiv Gandhi Salai",
      "Adyar"
    ]
  },
  {
    "busNo": "568C",
    "start": "Mamallapu ram",
    "destination": "CMBT",
    "routeStops": "Rajiv Gandhi Salai",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Rajiv Gandhi Salai",
      "CMBT"
    ]
  },
  {
    "busNo": "599",
    "start": "Mamallapu ram",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Adyar, Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "Mamallapuram",
    "stops": [
      "Mamallapu ram",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "T. Nagar"
    ]
  },
  {
    "busNo": "44B",
    "start": "Manali New Town",
    "destination": "Triplicane",
    "routeStops": "",
    "areaSection": "Manali Pudhu Nagar",
    "stops": [
      "Manali New Town",
      "Triplicane"
    ]
  },
  {
    "busNo": "41D",
    "start": "Mandaveli",
    "destination": "Avadi",
    "routeStops": "Ambattur OT, Korattur, Lucas,Thirumangalam, Amijikarai, KMC, Chetpet,Sterling road, Gemini,Teynampet,Nandanam, Adyar Gate",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Ambattur OT",
      "Korattur",
      "Lucas",
      "Thirumangalam",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "Sterling road",
      "Gemini",
      "Teynampet",
      "Nandanam",
      "Adyar Gate",
      "Avadi"
    ]
  },
  {
    "busNo": "41D Cut",
    "start": "Mandaveli",
    "destination": "Senthil Nagar",
    "routeStops": "Thirumullaivoyal, Ambattur OT, Korattur, Amijikarai,KMC, Chetpet, Sterling road, Gemini,Teynampet, Nandanam",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Thirumullaivoyal",
      "Ambattur OT",
      "Korattur",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "Sterling road",
      "Gemini",
      "Teynampet",
      "Nandanam",
      "Senthil Nagar"
    ]
  },
  {
    "busNo": "41F",
    "start": "Mandaveli",
    "destination": "CMBT",
    "routeStops": "Luz, Gemini, Valluvar Kottam, Loyola College, Choolaimedu, Anna Arch",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Luz",
      "Gemini",
      "Valluvar Kottam",
      "Loyola College",
      "Choolaimedu",
      "Anna Arch",
      "CMBT"
    ]
  },
  {
    "busNo": "577",
    "start": "Mandaveli",
    "destination": "Chengalpattu",
    "routeStops": "Singaperumal Koil, Maraimalai Nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Pallavaram, Guindy, Adyar, AMS",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Singaperumal Koil",
      "Maraimalai Nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Adyar",
      "AMS",
      "Chengalpattu"
    ]
  },
  {
    "busNo": "3A",
    "start": "Mandaveli",
    "destination": "High Court",
    "routeStops": "Mylapore, Luz, Alwarpet, Royapetah, L.I.C, Central",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Mylapore",
      "Luz",
      "Alwarpet",
      "Royapetah",
      "L.I.C",
      "Central",
      "High Court"
    ]
  },
  {
    "busNo": "21",
    "start": "Mandaveli",
    "destination": "Broadway",
    "routeStops": "Mylapore, Luz, Ajanta, Express Avenue, L.I.C, Simpson, Central",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Mylapore",
      "Luz",
      "Ajanta",
      "Express Avenue",
      "L.I.C",
      "Simpson",
      "Central",
      "Broadway"
    ]
  },
  {
    "busNo": "29",
    "start": "Mandaveli",
    "destination": "Vinayagapuram",
    "routeStops": "Kolahur, Agaram, Venus, Ptaaalam, Doveton, Egmore, L.I.C, Royapettah, Luz, Mylapore",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Kolahur",
      "Agaram",
      "Venus",
      "Ptaaalam",
      "Doveton",
      "Egmore",
      "L.I.C",
      "Royapettah",
      "Luz",
      "Mylapore",
      "Vinayagapuram"
    ]
  },
  {
    "busNo": "29J",
    "start": "Mandaveli",
    "destination": "Madhavaram",
    "routeStops": "Moolakadai, Perambur, Jamaliya, Otteri, KMC, Chetpet, Sterling Road/College Road, Gemini, Mylapore",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Moolakadai",
      "Perambur",
      "Jamaliya",
      "Otteri",
      "KMC",
      "Chetpet",
      "Sterling Road/College Road",
      "Gemini",
      "Mylapore",
      "Madhavaram"
    ]
  },
  {
    "busNo": "54F",
    "start": "Mandaveli",
    "destination": "Poonamallee",
    "routeStops": "Kumananchavadi, Iyyapanthangal, Porur, Guindy, Adayar",
    "areaSection": "Mandaveli",
    "stops": [
      "Mandaveli",
      "Kumananchavadi",
      "Iyyapanthangal",
      "Porur",
      "Guindy",
      "Adayar",
      "Poonamallee"
    ]
  },
  {
    "busNo": "E18 xt",
    "start": "Maraimalai nagar",
    "destination": "High Court",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Tambaram, Vandalur Zoo, Guduvanchery",
    "areaSection": "Maraimalai Nagar",
    "stops": [
      "Maraimalai nagar",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery",
      "High Court"
    ]
  },
  {
    "busNo": "G18 xt",
    "start": "Maraimalai nagar",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Guindy, Pallavaram, Chromepet, Tambaram, Vandalur Zoo, Guduvanchery",
    "areaSection": "Maraimalai Nagar",
    "stops": [
      "Maraimalai nagar",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery",
      "T.Nagar"
    ]
  },
  {
    "busNo": "552",
    "start": "Maraimalai Nagar",
    "destination": "Velachery",
    "routeStops": "Guindy",
    "areaSection": "Maraimalai Nagar",
    "stops": [
      "Maraimalai Nagar",
      "Guindy",
      "Velachery"
    ]
  },
  {
    "busNo": "118",
    "start": "Maraimalai Nagar I.E",
    "destination": "Tambaram",
    "routeStops": "Irumbuliyur, Perugalathur, Vandalur Gate, Vandalur Zoo,Oorapakkam School, Oorapakkam Tea shop,Guduvanchery, SRM University",
    "areaSection": "Maraimalai Nagar",
    "stops": [
      "Maraimalai Nagar I.E",
      "Irumbuliyur",
      "Perugalathur",
      "Vandalur Gate",
      "Vandalur Zoo",
      "Oorapakkam School",
      "Oorapakkam Tea shop",
      "Guduvanchery",
      "SRM University",
      "Tambaram"
    ]
  },
  {
    "busNo": "29C xt",
    "start": "Mathur MMDA",
    "destination": "Thiruvanmiyur",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, Perambur",
    "areaSection": "Mathur MMDA",
    "stops": [
      "Mathur MMDA",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "Perambur",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "29D",
    "start": "Mathur MMDA",
    "destination": "V House",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, Perambur, Otteri, Devoton, Egmore, Pudhupet, Walaja Road",
    "areaSection": "Mathur MMDA",
    "stops": [
      "Mathur MMDA",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "Perambur",
      "Otteri",
      "Devoton",
      "Egmore",
      "Pudhupet",
      "Walaja Road",
      "V House"
    ]
  },
  {
    "busNo": "38A",
    "start": "Mathur MMDA",
    "destination": "Broadway",
    "routeStops": "",
    "areaSection": "Mathur MMDA",
    "stops": [
      "Mathur MMDA",
      "Broadway"
    ]
  },
  {
    "busNo": "162A",
    "start": "Mathur MMDA",
    "destination": "Avadi",
    "routeStops": "Puzhal",
    "areaSection": "Mathur MMDA",
    "stops": [
      "Mathur MMDA",
      "Puzhal",
      "Avadi"
    ]
  },
  {
    "busNo": "270J",
    "start": "Mathur",
    "destination": "CMBT",
    "routeStops": "Thirumangalam, Madhavaram",
    "areaSection": "Mathur MMDA",
    "stops": [
      "Mathur",
      "Thirumangalam",
      "Madhavaram",
      "CMBT"
    ]
  },
  {
    "busNo": "147T",
    "start": "Mathur MMDA",
    "destination": "T.Nagar",
    "routeStops": "Madhavaram, Moolakadai, Retteri, Thirumangalam, Rountana, Loyola College, Mahalingapuram, Panagal park",
    "areaSection": "Mathur MMDA",
    "stops": [
      "Mathur MMDA",
      "Madhavaram",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "Rountana",
      "Loyola College",
      "Mahalingapuram",
      "Panagal park",
      "T.Nagar"
    ]
  },
  {
    "busNo": "H70",
    "start": "Menambedu",
    "destination": "CMBT",
    "routeStops": "Ambattur OT",
    "areaSection": "Menambedu",
    "stops": [
      "Menambedu",
      "Ambattur OT",
      "CMBT"
    ]
  },
  {
    "busNo": "L70",
    "start": "Menambedu",
    "destination": "Tambaram",
    "routeStops": "Korattur, CMBT, Vadapalani, Udhayam Theater",
    "areaSection": "Menambedu",
    "stops": [
      "Menambedu",
      "Korattur",
      "CMBT",
      "Vadapalani",
      "Udhayam Theater",
      "Tambaram"
    ]
  },
  {
    "busNo": "40",
    "start": "Meenambe du",
    "destination": "Anna Square",
    "routeStops": "Triplicane, Pudhupet, Egmore, Dasaprakash, Taylors road, ICF, Nathamuni, Lucas, Ambathur IE, Ambathur OT, Venkatapuram",
    "areaSection": "Menambedu",
    "stops": [
      "Meenambe du",
      "Triplicane",
      "Pudhupet",
      "Egmore",
      "Dasaprakash",
      "Taylors road",
      "ICF",
      "Nathamuni",
      "Lucas",
      "Ambathur IE",
      "Ambathur OT",
      "Venkatapuram",
      "Anna Square"
    ]
  },
  {
    "busNo": "64P",
    "start": "Minjur",
    "destination": "Perambur",
    "routeStops": "Napalayam, Manali new town, MFL, CPCL, Manali, Madhavaram Milk colony, Moolakadai",
    "areaSection": "Minjur",
    "stops": [
      "Minjur",
      "Napalayam",
      "Manali new town",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk colony",
      "Moolakadai",
      "Perambur"
    ]
  },
  {
    "busNo": "56P",
    "start": "Minjur Ne w Bus Stand",
    "destination": "Broadway",
    "routeStops": "V. Nagar, TONDAIAYRPET, THIRUVETRIYUR B.S, SATHIYAMOORTHY NAGAR, NAPALAYAM, Minjur B.D.O",
    "areaSection": "Minjur",
    "stops": [
      "Minjur Ne w Bus Stand",
      "V. Nagar",
      "TONDAIAYRPET",
      "THIRUVETRIYUR B.S",
      "SATHIYAMOORTHY NAGAR",
      "NAPALAYAM",
      "Minjur B.D.O",
      "Broadway"
    ]
  },
  {
    "busNo": "M64B",
    "start": "Minjur",
    "destination": "Broadway",
    "routeStops": "Napalayam, Manali New Town, MFL, CPCL, Manali, Madhavaram Milk colony, Moolakadai, Perambur market, Pulianthope, Doveton, Central R.S",
    "areaSection": "Minjur",
    "stops": [
      "Minjur",
      "Napalayam",
      "Manali New Town",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk colony",
      "Moolakadai",
      "Perambur market",
      "Pulianthope",
      "Doveton",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "558A",
    "start": "Minjur",
    "destination": "RedHills",
    "routeStops": "Karanodai",
    "areaSection": "Minjur",
    "stops": [
      "Minjur",
      "Karanodai",
      "RedHills"
    ]
  },
  {
    "busNo": "558L",
    "start": "Minjur",
    "destination": "CMBT",
    "routeStops": "Redhills, Karanodai, Ponneri",
    "areaSection": "Minjur",
    "stops": [
      "Minjur",
      "Redhills",
      "Karanodai",
      "Ponneri",
      "CMBT"
    ]
  },
  {
    "busNo": "558M",
    "start": "Minjur N.T.",
    "destination": "Red Hills",
    "routeStops": "",
    "areaSection": "Minjur",
    "stops": [
      "Minjur N.T.",
      "Red Hills"
    ]
  },
  {
    "busNo": "70W",
    "start": "Mugappair West",
    "destination": "Velachery",
    "routeStops": "Wavin, Collector Nagar, CMBT, Vadapalani, Ashok Pillar, Guindy",
    "areaSection": "Mogappair West",
    "stops": [
      "Mugappair West",
      "Wavin",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy",
      "Velachery"
    ]
  },
  {
    "busNo": "J70",
    "start": "Mogappair West",
    "destination": "Guindy I.E",
    "routeStops": "Collector Nagar, CMBT, Vadapalani, Udhayam Theater",
    "areaSection": "Mogappair West",
    "stops": [
      "Mogappair West",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Udhayam Theater",
      "Guindy I.E"
    ]
  },
  {
    "busNo": "558B",
    "start": "Moolakadai",
    "destination": "Pazhaverkadu",
    "routeStops": "Madhavaram, Redhills, Karanodai, Ponneri, Kanchivoyal, Thirupalaivanam, Perliyambakkam, Pulicut",
    "areaSection": "Moolakkadai",
    "stops": [
      "Moolakadai",
      "Madhavaram",
      "Redhills",
      "Karanodai",
      "Ponneri",
      "Kanchivoyal",
      "Thirupalaivanam",
      "Perliyambakkam",
      "Pulicut",
      "Pazhaverkadu"
    ]
  },
  {
    "busNo": "5K",
    "start": "Mylapore",
    "destination": "Taramani",
    "routeStops": "",
    "areaSection": "Mylapore",
    "stops": [
      "Mylapore",
      "Taramani"
    ]
  },
  {
    "busNo": "M15",
    "start": "Mylapore",
    "destination": "Medavakkam",
    "routeStops": "Adyar, Thiruvanmiyur, SRP Tools, Velachery, Pallikaranai",
    "areaSection": "Mylapore",
    "stops": [
      "Mylapore",
      "Adyar",
      "Thiruvanmiyur",
      "SRP Tools",
      "Velachery",
      "Pallikaranai",
      "Medavakkam"
    ]
  },
  {
    "busNo": "M15 xt",
    "start": "Mylapore",
    "destination": "Tambaram East",
    "routeStops": "Adyar, Thiruvanmiyur, SRP Tools, Velachery, Pallikaranai, Medavakkam, Camp Road",
    "areaSection": "Mylapore",
    "stops": [
      "Mylapore",
      "Adyar",
      "Thiruvanmiyur",
      "SRP Tools",
      "Velachery",
      "Pallikaranai",
      "Medavakkam",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "5B",
    "start": "Mylapore",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Anna University, Adyar, Sathyastudio, Mandaveli",
    "areaSection": "Mylapore",
    "stops": [
      "Mylapore",
      "Saidapet",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "Mandaveli",
      "T. Nagar"
    ]
  },
  {
    "busNo": "12C",
    "start": "Mylapore",
    "destination": "Saligramam",
    "routeStops": "Vadapalani, Rangarajapuram, Panagal Park, S.I.E.T, Adyar Gate, Mandaveli",
    "areaSection": "Mylapore",
    "stops": [
      "Mylapore",
      "Vadapalani",
      "Rangarajapuram",
      "Panagal Park",
      "S.I.E.T",
      "Adyar Gate",
      "Mandaveli",
      "Saligramam"
    ]
  },
  {
    "busNo": "M14",
    "start": "N.G.O Colony B.S",
    "destination": "Medavakkam Junction",
    "routeStops": "Adambakkam, Vanuvampet, Ullagaram, Puzhithivakkam, Madipakkam Koot rd, Ganesh Nagar, Kilkattalai, Kovilambakkam, Vadakkupet, Vellaikal, Bell Nagar, Medavakkam",
    "areaSection": "NGO Colony",
    "stops": [
      "N.G.O Colony B.S",
      "Adambakkam",
      "Vanuvampet",
      "Ullagaram",
      "Puzhithivakkam",
      "Madipakkam Koot rd",
      "Ganesh Nagar",
      "Kilkattalai",
      "Kovilambakkam",
      "Vadakkupet",
      "Vellaikal",
      "Bell Nagar",
      "Medavakkam",
      "Medavakkam Junction"
    ]
  },
  {
    "busNo": "52S",
    "start": "Nemilicheri",
    "destination": "Pozhichalur",
    "routeStops": "Chromepet, Pallavaram",
    "areaSection": "Nemilicherry",
    "stops": [
      "Nemilicheri",
      "Chromepet",
      "Pallavaram",
      "Pozhichalur"
    ]
  },
  {
    "busNo": "52E",
    "start": "Nemilicheri",
    "destination": "High Court",
    "routeStops": "Chromepet, Pallavaram, Guindy, Saidapet, DMS, TVS, LIC, Central RS",
    "areaSection": "Nemilicherry",
    "stops": [
      "Nemilicheri",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "52F",
    "start": "Nemilicheri",
    "destination": "T.Nagar",
    "routeStops": "Chromepet, Pallavaram, Guindy, Saidapet",
    "areaSection": "Nemilicherry",
    "stops": [
      "Nemilicheri",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "T51S",
    "start": "Okkiam Thoraippak kam",
    "destination": "Guduvanchery",
    "routeStops": "Vandalur, Tambaram East, Camp Road, Medavakkam, Sholinganallur",
    "areaSection": "Okkiyam Thoraippakkam",
    "stops": [
      "Okkiam Thoraippak kam",
      "Vandalur",
      "Tambaram East",
      "Camp Road",
      "Medavakkam",
      "Sholinganallur",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "19C",
    "start": "Okkiam Thorapakkam",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Madhya Kailash, Tidel park, SRP Tools, Perugudi",
    "areaSection": "Okkiyam Thoraippakkam",
    "stops": [
      "Okkiam Thorapakkam",
      "Saidapet",
      "Madhya Kailash",
      "Tidel park",
      "SRP Tools",
      "Perugudi",
      "T. Nagar"
    ]
  },
  {
    "busNo": "129",
    "start": "Okkium Thoraipakk am",
    "destination": "Perambur",
    "routeStops": "Perungudi, Tidel Park, Saidapet, Gemini, LIC, KMC, SHIVASHANMUGAPURAM",
    "areaSection": "Okkiyam Thoraippakkam",
    "stops": [
      "Okkium Thoraipakk am",
      "Perungudi",
      "Tidel Park",
      "Saidapet",
      "Gemini",
      "LIC",
      "KMC",
      "SHIVASHANMUGAPURAM",
      "Perambur"
    ]
  },
  {
    "busNo": "79K",
    "start": "Oragadam",
    "destination": "Keelkattalai",
    "routeStops": "Padappai, Mudichur, West Tambaram, East Tambaram, Camp Road, Kamarajapuram, Medavakkam Koot Road, Kovilambakkam",
    "areaSection": "Oragadam",
    "stops": [
      "Oragadam",
      "Padappai",
      "Mudichur",
      "West Tambaram",
      "East Tambaram",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam Koot Road",
      "Kovilambakkam",
      "Keelkattalai"
    ]
  },
  {
    "busNo": "20C",
    "start": "Oragadam",
    "destination": "Broadway",
    "routeStops": "Purasaiwakkam, Villivakkam, Nadhamuni, Padi, Ambattur I.E, Dunlop, Ambattur OT",
    "areaSection": "Oragadam",
    "stops": [
      "Oragadam",
      "Purasaiwakkam",
      "Villivakkam",
      "Nadhamuni",
      "Padi",
      "Ambattur I.E",
      "Dunlop",
      "Ambattur OT",
      "Broadway"
    ]
  },
  {
    "busNo": "27R",
    "start": "Oragadam",
    "destination": "Anna Square",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Choolaimedu, Anna Arch, Thirumangalam, Vavin, Ambattur I.E,Ambattur OT",
    "areaSection": "Oragadam",
    "stops": [
      "Oragadam",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Choolaimedu",
      "Anna Arch",
      "Thirumangalam",
      "Vavin",
      "Ambattur I.E",
      "Ambattur OT",
      "Anna Square"
    ]
  },
  {
    "busNo": "27T",
    "start": "Oragadam",
    "destination": "T.Nagar",
    "routeStops": "Ambattur OT, Ambattur I.E, Collector Nagar, CMBT, Vadapalani, Liberty, Bharathi nagar, Panagal park",
    "areaSection": "Oragadam",
    "stops": [
      "Oragadam",
      "Ambattur OT",
      "Ambattur I.E",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Liberty",
      "Bharathi nagar",
      "Panagal park",
      "T.Nagar"
    ]
  },
  {
    "busNo": "248xt",
    "start": "Oragadam",
    "destination": "V Nagar",
    "routeStops": "Ambattur, Ambattur IE, Padi, Lucas TVS, ICF, Joint Office, Otteri, Basin Bridge",
    "areaSection": "Oragadam",
    "stops": [
      "Oragadam",
      "Ambattur",
      "Ambattur IE",
      "Padi",
      "Lucas TVS",
      "ICF",
      "Joint Office",
      "Otteri",
      "Basin Bridge",
      "V Nagar"
    ]
  },
  {
    "busNo": "M79",
    "start": "Padappai",
    "destination": "T.Nagar",
    "routeStops": "Samthuvapuram, Karasangal, Mannivakkam, Mudichur, Old Perugalathur, Tambaram, Chromepet, Pallavaram, Meenambakkam, Asharkana, Guindy, Little mount, Saidapet",
    "areaSection": "Padappai",
    "stops": [
      "Padappai",
      "Samthuvapuram",
      "Karasangal",
      "Mannivakkam",
      "Mudichur",
      "Old Perugalathur",
      "Tambaram",
      "Chromepet",
      "Pallavaram",
      "Meenambakkam",
      "Asharkana",
      "Guindy",
      "Little mount",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "80",
    "start": "Padappai",
    "destination": "Tambaram",
    "routeStops": "Manimangalam",
    "areaSection": "Padappai",
    "stops": [
      "Padappai",
      "Manimangalam",
      "Tambaram"
    ]
  },
  {
    "busNo": "510",
    "start": "Padappai",
    "destination": "CMBT",
    "routeStops": "Karasangal, Mudichur, Tambaram, Pallavaram, Ashok Pillar",
    "areaSection": "Padappai",
    "stops": [
      "Padappai",
      "Karasangal",
      "Mudichur",
      "Tambaram",
      "Pallavaram",
      "Ashok Pillar",
      "CMBT"
    ]
  },
  {
    "busNo": "555P",
    "start": "Padappai",
    "destination": "Kelambakkam",
    "routeStops": "Karasangal, Vandalur, Mambakkam",
    "areaSection": "Padappai",
    "stops": [
      "Padappai",
      "Karasangal",
      "Vandalur",
      "Mambakkam",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "579",
    "start": "Padappai",
    "destination": "Broadway",
    "routeStops": "Karasangal, Mudichur, Tambaram, Pallavaram, Guindy, Saidapet, LIC",
    "areaSection": "Padappai",
    "stops": [
      "Padappai",
      "Karasangal",
      "Mudichur",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "LIC",
      "Broadway"
    ]
  },
  {
    "busNo": "579V",
    "start": "Padappai",
    "destination": "Velachery",
    "routeStops": "Mudichur, Tambaram, Chromepet, Eachangadu, Kilkattalai, Madipakkam, Ram Nagar",
    "areaSection": "Padappai",
    "stops": [
      "Padappai",
      "Mudichur",
      "Tambaram",
      "Chromepet",
      "Eachangadu",
      "Kilkattalai",
      "Madipakkam",
      "Ram Nagar",
      "Velachery"
    ]
  },
  {
    "busNo": "114T",
    "start": "Padiyanallur",
    "destination": "T.Nagar",
    "routeStops": "Panagal park, Liberty, Power house, Vadapalani Koil, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Kolathur, Retteri, Puzhal, Kavangarai, Ayurveda Ashramam, Red Hills",
    "areaSection": "Padiyanallur",
    "stops": [
      "Padiyanallur",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani Koil",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Kolathur",
      "Retteri",
      "Puzhal",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills",
      "T.Nagar"
    ]
  },
  {
    "busNo": "242xt",
    "start": "Padiyanallur",
    "destination": "Broadway",
    "routeStops": "Perambur, Central R.S",
    "areaSection": "Padiyanallur",
    "stops": [
      "Padiyanallur",
      "Perambur",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "T242",
    "start": "Padiyanallur",
    "destination": "Thiruvanmiyur",
    "routeStops": "Puzhal, Retteri, Kolathur, Perambur, Doveton, Vepery, Central R.S, Broadway, Marina, Santhome,Adyar",
    "areaSection": "Padiyanallur",
    "stops": [
      "Padiyanallur",
      "Puzhal",
      "Retteri",
      "Kolathur",
      "Perambur",
      "Doveton",
      "Vepery",
      "Chennai Central",
      "Broadway",
      "Marina",
      "Santhome",
      "Adyar",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "A57",
    "start": "Padiyanallur",
    "destination": "High Court",
    "routeStops": "Beach R.S, Stanley, Mint, Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red hills",
    "areaSection": "Padiyanallur",
    "stops": [
      "Padiyanallur",
      "Chennai Beach",
      "Stanley",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red hills",
      "High Court"
    ]
  },
  {
    "busNo": "62xt",
    "start": "Padiyanallur",
    "destination": "Poonamallee",
    "routeStops": "Karayan chavadi, Seeneerkuppam, Goverdhangiri, Avadi Market, Avadi, Thirumullaivoyal, Ambathur OT, Pudur, Kallikuppam, Puzhal, Bypass road, Kavangarai, Ayurveda Ashramam, Red Hills",
    "areaSection": "Padiyanallur",
    "stops": [
      "Padiyanallur",
      "Karayan chavadi",
      "Seeneerkuppam",
      "Goverdhangiri",
      "Avadi Market",
      "Avadi",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Pudur",
      "Kallikuppam",
      "Puzhal",
      "Bypass road",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills",
      "Poonamallee"
    ]
  },
  {
    "busNo": "C70xt",
    "start": "Padiyanallur",
    "destination": "Guindy Estate",
    "routeStops": "Ashok nagar, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Padi, Thathankuppam, Kolathur, Retteri, Puzhal, Kavangarai, Ayurveda Ashramam, Red Hills",
    "areaSection": "Padiyanallur",
    "stops": [
      "Padiyanallur",
      "Ashok nagar",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Padi",
      "Thathankuppam",
      "Kolathur",
      "Retteri",
      "Puzhal",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills",
      "Guindy Estate"
    ]
  },
  {
    "busNo": "114P",
    "start": "Padiyanallur",
    "destination": "Koyambedu Market",
    "routeStops": "Puzhal, Nethaji circle, Retteri, Lucas, Thriumangalam",
    "areaSection": "Padiyanallur",
    "stops": [
      "Padiyanallur",
      "Puzhal",
      "Nethaji circle",
      "Retteri",
      "Lucas",
      "Thriumangalam",
      "Koyambedu Market"
    ]
  },
  {
    "busNo": "52T",
    "start": "Pallavaram",
    "destination": "Thirumalai Nagar",
    "routeStops": "Chromepet, Hasthinapuram",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Chromepet",
      "Hasthinapuram",
      "Thirumalai Nagar"
    ]
  },
  {
    "busNo": "55A",
    "start": "Pallavaram",
    "destination": "Pazhanthandalam",
    "routeStops": "Nagalkeni, Thiruneermalai, Thirumudivakkam",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Nagalkeni",
      "Thiruneermalai",
      "Thirumudivakkam",
      "Pazhanthandalam"
    ]
  },
  {
    "busNo": "517",
    "start": "Pallavaram",
    "destination": "Vadanemili",
    "routeStops": "Chromepet, Tambaram Sanatorium, Tambaram, Vandalur, Kandigai, Mambakkam, Pudhupakkam, Chettinad Hospital, Kelambakkam, Kovalam, Thiruvidanthai",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Chromepet",
      "Tambaram Sanatorium",
      "Tambaram",
      "Vandalur",
      "Kandigai",
      "Mambakkam",
      "Pudhupakkam",
      "Chettinad Hospital",
      "Kelambakkam",
      "Kovalam",
      "Thiruvidanthai",
      "Vadanemili"
    ]
  },
  {
    "busNo": "517K",
    "start": "Pallavaram",
    "destination": "Kovalam",
    "routeStops": "Eachangadu, Kovilambakkam, Medavakkam Koot Road, Sholinganallur, Kelambakkam",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Eachangadu",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Sholinganallur",
      "Kelambakkam",
      "Kovalam"
    ]
  },
  {
    "busNo": "517T",
    "start": "Pallavaram",
    "destination": "Thirupporur",
    "routeStops": "Eachangadu, Kovilambakkam, Medavakkam Koot Road, Sholinganallur, Kelambakkam",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Eachangadu",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "583E",
    "start": "Pallavaram",
    "destination": "Vallakkottai",
    "routeStops": "Tambaram, Mudichur, Padappai, Serapanancherri, Oragadam, Maathur",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Tambaram",
      "Mudichur",
      "Padappai",
      "Serapanancherri",
      "Oragadam",
      "Maathur",
      "Vallakkottai"
    ]
  },
  {
    "busNo": "R21",
    "start": "Pallavaram",
    "destination": "Broadway",
    "routeStops": "Eachangadu, Kilkattalai, Velachery, SRP, Adayar, Foreshore Estate, Anna Square",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Eachangadu",
      "Kilkattalai",
      "Velachery",
      "SRP",
      "Adayar",
      "Foreshore Estate",
      "Anna Square",
      "Broadway"
    ]
  },
  {
    "busNo": "A70",
    "start": "Pallavaram",
    "destination": "Avadi",
    "routeStops": "Ambattur, Padi, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Kathipara, Chennai Airport",
    "areaSection": "Pallavaram",
    "stops": [
      "Pallavaram",
      "Ambattur",
      "Padi",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Kathipara",
      "Chennai Airport",
      "Avadi"
    ]
  },
  {
    "busNo": "53S",
    "start": "Pattabiram",
    "destination": "CMBT",
    "routeStops": "Thiruverkadu, Sundaransozhapuram, Mettupalayam,Thandarai",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Thiruverkadu",
      "Sundaransozhapuram",
      "Mettupalayam",
      "Thandarai",
      "CMBT"
    ]
  },
  {
    "busNo": "66P",
    "start": "Pattabiram",
    "destination": "Tambaram",
    "routeStops": "Pallavaram, Kundrathur, Poonamallee,Parivakkam, Chittukadu,Thandarai",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Pallavaram",
      "Kundrathur",
      "Poonamallee",
      "Parivakkam",
      "Chittukadu",
      "Thandarai",
      "Tambaram"
    ]
  },
  {
    "busNo": "F70",
    "start": "Pattabiram",
    "destination": "Guindy TVK Estate",
    "routeStops": "Avadi, Ambattur I.E, Lucas, Anna Nagar West, Koyambedu market, CMBT, Vadapalani, West Saidapet",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Avadi",
      "Ambattur I.E",
      "Lucas",
      "Anna Nagar West",
      "Koyambedu market",
      "CMBT",
      "Vadapalani",
      "West Saidapet",
      "Guindy TVK Estate"
    ]
  },
  {
    "busNo": "121E",
    "start": "Pattabiram",
    "destination": "M.K.B Nagar",
    "routeStops": "Vyasarpadi, Moolakadai, TVK Nagar, Retteri, Lucas, Ambattur, Avadi",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Vyasarpadi",
      "Moolakadai",
      "TVK Nagar",
      "Retteri",
      "Lucas",
      "Ambattur",
      "Avadi",
      "M.K.B Nagar"
    ]
  },
  {
    "busNo": "M153",
    "start": "Pattabiram",
    "destination": "CMBT",
    "routeStops": "Thandarai,Chittukadu,Thirumazhisai, P oonamallee,Kumananchavadi, Madura voyal",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Thandarai",
      "Chittukadu",
      "Thirumazhisai",
      "P oonamallee",
      "Kumananchavadi",
      "Madura voyal",
      "CMBT"
    ]
  },
  {
    "busNo": "170P",
    "start": "Pattabiram",
    "destination": "Tambaram",
    "routeStops": "Avadi, Ambattur OT, Golden Flats, Thirumangalam, CMBT, Vadapalani, Pallavaram, Chromepet",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Avadi",
      "Ambattur OT",
      "Golden Flats",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Pallavaram",
      "Chromepet",
      "Tambaram"
    ]
  },
  {
    "busNo": "536",
    "start": "Pattabiram",
    "destination": "Ponneri",
    "routeStops": "Avadi, Ambattur O.T., Pudhur, Puzhal, Red Hills",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Avadi",
      "Ambattur O.T.",
      "Pudhur",
      "Puzhal",
      "Red Hills",
      "Ponneri"
    ]
  },
  {
    "busNo": "565",
    "start": "Pattabiram",
    "destination": "Sriperumbudur",
    "routeStops": "Avadi, Govardhanagiri, Karaiyanchavadi, Poonamallee, Irrunkatturkottai",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Avadi",
      "Govardhanagiri",
      "Karaiyanchavadi",
      "Poonamallee",
      "Irrunkatturkottai",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "27H xt",
    "start": "Pattabiram",
    "destination": "Anna Square",
    "routeStops": "Triplicane, LIC, DPI, Sterling Road, Anna Arch, Thirumangalam, Padi, Ambattur OT, Avadi",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Triplicane",
      "LIC",
      "DPI",
      "Sterling Road",
      "Anna Arch",
      "Thirumangalam",
      "Padi",
      "Ambattur OT",
      "Avadi",
      "Anna Square"
    ]
  },
  {
    "busNo": "34xt",
    "start": "Pattabiram",
    "destination": "Thiruvottiyur",
    "routeStops": "Ambattur I.E, Thirumangalam, Rountana, Chinthamani, Kellys, Purasaiwakkam, Choolai P.O., Regal, V.Nagar, Tondiarpet, Tollgate, Therady",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Ambattur I.E",
      "Thirumangalam",
      "Rountana",
      "Chinthamani",
      "Kellys",
      "Purasaiwakkam",
      "Choolai P.O.",
      "Regal",
      "V.Nagar",
      "Tondiarpet",
      "Tollgate",
      "Therady",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "54C",
    "start": "Pattabiram",
    "destination": "Poonamallee",
    "routeStops": "Parivakkam, Chittukadu,Thandarai",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Parivakkam",
      "Chittukadu",
      "Thandarai",
      "Poonamallee"
    ]
  },
  {
    "busNo": "65P",
    "start": "Pattabiram",
    "destination": "Ambattur I.E",
    "routeStops": "Ambattur OT, Avadi Market, Poonamallee, Thandurai",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Ambattur OT",
      "Avadi Market",
      "Poonamallee",
      "Thandurai",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "B70",
    "start": "Pattabiram",
    "destination": "Guindy Estate",
    "routeStops": "Avadi, Ambattur OT, Padi, CMBT, Vadapalani, Udhayam, CIPET",
    "areaSection": "Pattabhiram",
    "stops": [
      "Pattabiram",
      "Avadi",
      "Ambattur OT",
      "Padi",
      "CMBT",
      "Vadapalani",
      "Udhayam",
      "CIPET",
      "Guindy Estate"
    ]
  },
  {
    "busNo": "566B",
    "start": "Pattur",
    "destination": "Kovalam",
    "routeStops": "Kundrathur, Anakaputhur, Pammal, Pallavaram, Chromepet, Tambaram Sanatorium, Tambaram, Perugalathur, Vandalur, Kandigai, Mambakkam, Pudhupakkam, Chettinad Hospital, Kelambakkam",
    "areaSection": "Pattur",
    "stops": [
      "Pattur",
      "Kundrathur",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Tambaram Sanatorium",
      "Tambaram",
      "Perugalathur",
      "Vandalur",
      "Kandigai",
      "Mambakkam",
      "Pudhupakkam",
      "Chettinad Hospital",
      "Kelambakkam",
      "Kovalam"
    ]
  },
  {
    "busNo": "17P",
    "start": "Pattur",
    "destination": "Vadapalani",
    "routeStops": "Mangadu, Porur, Virugambakkam",
    "areaSection": "Pattur",
    "stops": [
      "Pattur",
      "Mangadu",
      "Porur",
      "Virugambakkam",
      "Vadapalani"
    ]
  },
  {
    "busNo": "154",
    "start": "Pattur",
    "destination": "T. Nagar",
    "routeStops": "Mangadu, Iyyapanthangal, Porur, Ramapuram, St.Thomas Mount, Guindy, Saidapet",
    "areaSection": "Pattur",
    "stops": [
      "Pattur",
      "Mangadu",
      "Iyyapanthangal",
      "Porur",
      "Ramapuram",
      "St.Thomas Mount",
      "Guindy",
      "Saidapet",
      "T. Nagar"
    ]
  },
  {
    "busNo": "595",
    "start": "Pazhaverka du",
    "destination": "Tollgate",
    "routeStops": "Thiruvottriyur, Sathyamoorthy nagar, Minjur, Kadapakkam, Thathanmanji, Perliyambakkam, Pulicut",
    "areaSection": "Pazhaverkadu",
    "stops": [
      "Pazhaverka du",
      "Thiruvottriyur",
      "Sathyamoorthy nagar",
      "Minjur",
      "Kadapakkam",
      "Thathanmanji",
      "Perliyambakkam",
      "Pulicut",
      "Tollgate"
    ]
  },
  {
    "busNo": "595A",
    "start": "Pazhaverka du",
    "destination": "Thiruvottiyur",
    "routeStops": "Sathyamoorthy nagar, Minjur, Kadapakkam, Thathanmanji, Perliyambakkam, Pulicut",
    "areaSection": "Pazhaverkadu",
    "stops": [
      "Pazhaverka du",
      "Sathyamoorthy nagar",
      "Minjur",
      "Kadapakkam",
      "Thathanmanji",
      "Perliyambakkam",
      "Pulicut",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "558B",
    "start": "Pazhaverka du",
    "destination": "Moolakadai",
    "routeStops": "Madhavaram, Redhills, Karanodai, Ponneri, Kanchivoyal, Thirupalaivanam, Perliyambakkam, Pulicut",
    "areaSection": "Pazhaverkadu",
    "stops": [
      "Pazhaverka du",
      "Madhavaram",
      "Redhills",
      "Karanodai",
      "Ponneri",
      "Kanchivoyal",
      "Thirupalaivanam",
      "Perliyambakkam",
      "Pulicut",
      "Moolakadai"
    ]
  },
  {
    "busNo": "591",
    "start": "Perambakk am",
    "destination": "T.Nagar",
    "routeStops": "Guindy, Porur, Poonamallee, Thandalam, Mannur, Kattukoot rd, Mappedu, Koovam",
    "areaSection": "Perambakkam",
    "stops": [
      "Perambakk am",
      "Guindy",
      "Porur",
      "Poonamallee",
      "Thandalam",
      "Mannur",
      "Kattukoot rd",
      "Mappedu",
      "Koovam",
      "T.Nagar"
    ]
  },
  {
    "busNo": "591B",
    "start": "Perambakk am",
    "destination": "Vadapalani",
    "routeStops": "Virugambakkam, Porur, Poonamallee, Thandalam, Mannur, Kattukoot rd, Mappedu",
    "areaSection": "Perambakkam",
    "stops": [
      "Perambakk am",
      "Virugambakkam",
      "Porur",
      "Poonamallee",
      "Thandalam",
      "Mannur",
      "Kattukoot rd",
      "Mappedu",
      "Vadapalani"
    ]
  },
  {
    "busNo": "583B",
    "start": "Perambakk am",
    "destination": "Tambaram",
    "routeStops": "Old Perungalathur, Manimangalam, Sriperumbudur, Kattu Koot road, Meppedu, Koovam",
    "areaSection": "Perambakkam",
    "stops": [
      "Perambakk am",
      "Old Perungalathur",
      "Manimangalam",
      "Sriperumbudur",
      "Kattu Koot road",
      "Meppedu",
      "Koovam",
      "Tambaram"
    ]
  },
  {
    "busNo": "29A",
    "start": "Perambur",
    "destination": "Anna Square",
    "routeStops": "Otteri, Devoton, Egmore, Pudhupet, Walaja Road, Bells Road, Triplicane",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Otteri",
      "Devoton",
      "Egmore",
      "Pudhupet",
      "Walaja Road",
      "Bells Road",
      "Triplicane",
      "Anna Square"
    ]
  },
  {
    "busNo": "29B",
    "start": "Perambur",
    "destination": "Saidapet",
    "routeStops": "Otteri, Doveton, KMC, Chetpet, Sterling Road/College Road, Gemini, DMS, T.Nagar",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Otteri",
      "Doveton",
      "KMC",
      "Chetpet",
      "Sterling Road/College Road",
      "Gemini",
      "DMS",
      "T.Nagar",
      "Saidapet"
    ]
  },
  {
    "busNo": "29C",
    "start": "Perambur",
    "destination": "Besant Nagar/Thiruva nmiyur",
    "routeStops": "Jamaliya, Otteri, KMC, Chetpet, Sterling Road/College Road, Gemini, Mylapore, Mandaveli, Adyar",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Jamaliya",
      "Otteri",
      "KMC",
      "Chetpet",
      "Sterling Road/College Road",
      "Gemini",
      "Mylapore",
      "Mandaveli",
      "Adyar",
      "Besant Nagar/Thiruva nmiyur"
    ]
  },
  {
    "busNo": "29E",
    "start": "Perambur",
    "destination": "Thiruverkadu",
    "routeStops": "Otteri, Purasawakkam High Road, Kellys, Aminjikarai, Koyambedu, Nerkundram, Maduravoyal, Velappanchavadi",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Otteri",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Koyambedu",
      "Nerkundram",
      "Maduravoyal",
      "Velappanchavadi",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "129",
    "start": "Perambur",
    "destination": "Okkium Thoraipakkam",
    "routeStops": "Perungudi, Tidel Park, Saidapet, Gemini, LIC, KMC, SHIVASHANMUGAPURAM",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Perungudi",
      "Tidel Park",
      "Saidapet",
      "Gemini",
      "LIC",
      "KMC",
      "SHIVASHANMUGAPURAM",
      "Okkium Thoraipakkam"
    ]
  },
  {
    "busNo": "129C",
    "start": "Perambur",
    "destination": "Nanganallur",
    "routeStops": "T.Nagar,Sterling Road,Chetpet,Otteri",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "T.Nagar",
      "Sterling Road",
      "Chetpet",
      "Otteri",
      "Nanganallur"
    ]
  },
  {
    "busNo": "142",
    "start": "Perambur",
    "destination": "Vinayagapuram",
    "routeStops": "",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Vinayagapuram"
    ]
  },
  {
    "busNo": "29N",
    "start": "Perambur",
    "destination": "Velachery",
    "routeStops": "Saidapet, T. Nagar, DMS, Gemini, Sterling Road/College Road, KMC",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Saidapet",
      "T. Nagar",
      "DMS",
      "Gemini",
      "Sterling Road/College Road",
      "KMC",
      "Velachery"
    ]
  },
  {
    "busNo": "64P",
    "start": "Perambur",
    "destination": "Minjur",
    "routeStops": "Napalayam, Manali new town, MFL, CPCL, Manali, Madhavaram Milk",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Napalayam",
      "Manali new town",
      "MFL",
      "CPCL",
      "Manali",
      "Madhavaram Milk",
      "Minjur"
    ]
  },
  {
    "busNo": "164",
    "start": "Perambur",
    "destination": "Mathur MMDA",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "Mathur MMDA"
    ]
  },
  {
    "busNo": "170N",
    "start": "Perambur",
    "destination": "Kilkattalai",
    "routeStops": "Nanganallur, Guindy, Udhayam, Vadapalani, CMBT, Thirumangalam, Retteri, Venus",
    "areaSection": "Perambur",
    "stops": [
      "Perambur",
      "Nanganallur",
      "Guindy",
      "Udhayam",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Retteri",
      "Venus",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "514",
    "start": "Periyapalay am",
    "destination": "CMBT",
    "routeStops": "Lucas, Puzhal, Red Hills, Karanodai,Janappan chathram x road, Bandikavanoor,Kannigaipair",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Lucas",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Janappan chathramx road",
      "Bandikavanoor",
      "Kannigaipair",
      "CMBT"
    ]
  },
  {
    "busNo": "505A",
    "start": "Periyapalay am",
    "destination": "Thiruvallur",
    "routeStops": "Vadamadurai, Vengal, Tamaraipakkam, Vishnuvakkam, Moolakarai, Ekkadu Kandigai",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Vadamadurai",
      "Vengal",
      "Tamaraipakkam",
      "Vishnuvakkam",
      "Moolakarai",
      "Ekkadu Kandigai",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "505P",
    "start": "Periyapalay am",
    "destination": "Red Hills",
    "routeStops": "Alamadhi, Tamaraipakkam, Vengal, Vadamadurai",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Alamadhi",
      "Tamaraipakkam",
      "Vengal",
      "Vadamadurai",
      "Red Hills"
    ]
  },
  {
    "busNo": "532",
    "start": "Periyapalay am",
    "destination": "Vallalar Nagar",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Arani",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Arani",
      "Vallalar Nagar"
    ]
  },
  {
    "busNo": "547",
    "start": "Periyapalay am",
    "destination": "V Nagar",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Siruvapuri",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Siruvapuri",
      "V Nagar"
    ]
  },
  {
    "busNo": "547A",
    "start": "Periyapalay am",
    "destination": "V Nagar",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Akarambakkam, Arani, Kosavampettai",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Akarambakkam",
      "Arani",
      "Kosavampettai",
      "V Nagar"
    ]
  },
  {
    "busNo": "563",
    "start": "Periyapalay am",
    "destination": "Ambattur I.E",
    "routeStops": "Ambattur OT, Avadi, Pattabiram",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Ambattur OT",
      "Avadi",
      "Pattabiram",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "580P",
    "start": "Periyapalay am",
    "destination": "Poonamallee",
    "routeStops": "Thirumazhisai, Vellavedu, Pudhuchatiram, Periyakottambedu, Kosavapalayam, Thiruninravur, Pakkam, Tamaraipakkam, Vadamadurai",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Thirumazhisai",
      "Vellavedu",
      "Pudhuchatiram",
      "Periyakottambedu",
      "Kosavapalayam",
      "Thiruninravur",
      "Pakkam",
      "Tamaraipakkam",
      "Vadamadurai",
      "Poonamallee"
    ]
  },
  {
    "busNo": "592G",
    "start": "Periyapalay am",
    "destination": "V Nagar",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai,Pandy Kavanoor Rd JN, Kannigaipair",
    "areaSection": "Periyapalayam",
    "stops": [
      "Periyapalay am",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Pandy Kavanoor Rd JN",
      "Kannigaipair",
      "V Nagar"
    ]
  },
  {
    "busNo": "29L",
    "start": "Periyar Nagar",
    "destination": "Thiruvanmiyur",
    "routeStops": "Egmore, Teynampet, Saidapet, Adyar",
    "areaSection": "Periyar Nagar",
    "stops": [
      "Periyar Nagar",
      "Egmore",
      "Teynampet",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "8A",
    "start": "Periyar Nagar",
    "destination": "Tollgate",
    "routeStops": "Tondiarpet, V.Nagar, Regal, Choolai P.O, Otteri,Jamalaya, Venus",
    "areaSection": "Periyar Nagar",
    "stops": [
      "Periyar Nagar",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O",
      "Otteri",
      "Jamalaya",
      "Venus",
      "Tollgate"
    ]
  },
  {
    "busNo": "B29N",
    "start": "Periyar nagar",
    "destination": "Velachery",
    "routeStops": "Saidapet, T. Nagar, DMS, Gemini, Sterling Road/College Road, KMC, Doveton, Perambur, Venus",
    "areaSection": "Periyar Nagar",
    "stops": [
      "Periyar nagar",
      "Saidapet",
      "T. Nagar",
      "DMS",
      "Gemini",
      "Sterling Road/College Road",
      "KMC",
      "Doveton",
      "Perambur",
      "Venus",
      "Velachery"
    ]
  },
  {
    "busNo": "42",
    "start": "Periyar Nagar",
    "destination": "Broadway",
    "routeStops": "Central R.S, Periamet, Natarajatheatre, Pulianthope, Pattalam, Kannigapuram, Perambur B.S, Venus, Peravallur",
    "areaSection": "Periyar Nagar",
    "stops": [
      "Periyar Nagar",
      "Chennai Central",
      "Periamet",
      "Natarajatheatre",
      "Pulianthope",
      "Pattalam",
      "Kannigapuram",
      "Perambur B.S",
      "Venus",
      "Peravallur",
      "Broadway"
    ]
  },
  {
    "busNo": "46B",
    "start": "Periyar Nagar",
    "destination": "CMBT",
    "routeStops": "Perambur, Ayanavaram, ICF, Anna Nagar East, Arumbakkam",
    "areaSection": "Periyar Nagar",
    "stops": [
      "Periyar Nagar",
      "Perambur",
      "Ayanavaram",
      "ICF",
      "Anna Nagar East",
      "Arumbakkam",
      "CMBT"
    ]
  },
  {
    "busNo": "138A",
    "start": "Periyar Nagar",
    "destination": "Thiruvottiyur",
    "routeStops": "Tondiarpet, Mint, Basin Bridge, Vyasarpadi, Moolakadai, TVK Nagar",
    "areaSection": "Periyar Nagar",
    "stops": [
      "Periyar Nagar",
      "Tondiarpet",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "TVK Nagar",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "170G",
    "start": "Periyar Nagar",
    "destination": "Tambaram",
    "routeStops": "",
    "areaSection": "Periyar Nagar",
    "stops": [
      "Periyar Nagar",
      "Tambaram"
    ]
  },
  {
    "busNo": "583P",
    "start": "Pondhur",
    "destination": "Tambaram",
    "routeStops": "Serapanancherri, Padappai, Mannivakkam, Mudichur",
    "areaSection": "Pondhur",
    "stops": [
      "Pondhur",
      "Serapanancherri",
      "Padappai",
      "Mannivakkam",
      "Mudichur",
      "Tambaram"
    ]
  },
  {
    "busNo": "49A",
    "start": "Poonamallee",
    "destination": "T.Nagar",
    "routeStops": "Kumananchavadi, Porur, K.K. Nagar, Ashok Pillar",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumananchavadi",
      "Porur",
      "K.K. Nagar",
      "Ashok Pillar",
      "T.Nagar"
    ]
  },
  {
    "busNo": "49B",
    "start": "Poonamallee",
    "destination": "T.Nagar",
    "routeStops": "Kumananchavadi, Mangadu, Porur, K.K. Nagar, Ashok Pillar",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumananchavadi",
      "Mangadu",
      "Porur",
      "K.K. Nagar",
      "Ashok Pillar",
      "T.Nagar"
    ]
  },
  {
    "busNo": "54",
    "start": "Poonamallee",
    "destination": "Broadway",
    "routeStops": "Kumananchavadi, Porur, Guindy, DMS, TVS, LIC, Central R.S",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumananchavadi",
      "Porur",
      "Guindy",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "54A",
    "start": "Poonamallee",
    "destination": "Thirunindravur",
    "routeStops": "Thirumazhisai, Vellavedu, Pudhuchatiram, Periyakottambedu, Kosavapalayam",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Pudhuchatiram",
      "Periyakottambedu",
      "Kosavapalayam",
      "Thirunindravur"
    ]
  },
  {
    "busNo": "54C",
    "start": "Poonamallee",
    "destination": "Pattabiram",
    "routeStops": "Parivakkam, Chittukadu,Thandarai",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Parivakkam",
      "Chittukadu",
      "Thandarai",
      "Pattabiram"
    ]
  },
  {
    "busNo": "54F",
    "start": "Poonamallee",
    "destination": "Mandaveli",
    "routeStops": "Kumananchavadi, Iyyapanthangal, Porur, Guindy, Adayar",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumananchavadi",
      "Iyyapanthangal",
      "Porur",
      "Guindy",
      "Adayar",
      "Mandaveli"
    ]
  },
  {
    "busNo": "54P",
    "start": "Poonamallee",
    "destination": "T.Nagar",
    "routeStops": "Kumanan chavadi, Mangadu, Paraniputhur, Baikadai, Moulivakkam, Porur, Guindy, Saidapet",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumanan chavadi",
      "Mangadu",
      "Paraniputhur",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Guindy",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "F54",
    "start": "Poonamallee",
    "destination": "Mandaveli",
    "routeStops": "Kumananchavadi, Iyyapanthangal, Porur, Guindy, Kotturpuram, Adyar Gate",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumananchavadi",
      "Iyyapanthangal",
      "Porur",
      "Guindy",
      "Kotturpuram",
      "Adyar Gate",
      "Mandaveli"
    ]
  },
  {
    "busNo": "62",
    "start": "Poonamallee",
    "destination": "Red Hills",
    "routeStops": "Karayan chavadi, Seeneerkuppam, Goverdhangiri, Avadi Market, Avadi, Thirumullaivoyal, Ambathur OT, Pudur, Kallikuppam, Puzhal, Bypass road, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Karayan chavadi",
      "Seeneerkuppam",
      "Goverdhangiri",
      "Avadi Market",
      "Avadi",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Pudur",
      "Kallikuppam",
      "Puzhal",
      "Bypass road",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills"
    ]
  },
  {
    "busNo": "62xt",
    "start": "Poonamallee",
    "destination": "Padiyanallur",
    "routeStops": "Karayan chavadi, Seeneerkuppam, Goverdhangiri, Avadi Market, Avadi, Thirumullaivoyal, Ambathur OT, Pudur, Kallikuppam, Puzhal, Bypass road, Kavangarai, Ayurveda Ashramam, Red Hills",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Karayan chavadi",
      "Seeneerkuppam",
      "Goverdhangiri",
      "Avadi Market",
      "Avadi",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Pudur",
      "Kallikuppam",
      "Puzhal",
      "Bypass road",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills",
      "Padiyanallur"
    ]
  },
  {
    "busNo": "65V",
    "start": "Poonamallee",
    "destination": "Villivakkam",
    "routeStops": "Nadhamuni, Padi, Ambattur I.E, Ambattur OT, Avadi, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Nadhamuni",
      "Padi",
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi",
      "Karaiyanchavadi",
      "Villivakkam"
    ]
  },
  {
    "busNo": "PP66",
    "start": "Poonamallee",
    "destination": "Vandalur Zoo",
    "routeStops": "Tambaram, Chromepet, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Tambaram",
      "Chromepet",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Karaiyanchavadi",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "66",
    "start": "Poonamallee",
    "destination": "Tambaram",
    "routeStops": "MEPZ, Chromepet, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "MEPZ",
      "Chromepet",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Karaiyanchavadi",
      "Tambaram"
    ]
  },
  {
    "busNo": "66S",
    "start": "Poonamallee",
    "destination": "Sholinganallur",
    "routeStops": "Mettukuppam, Kamatchi Hospital, Echangadu, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Mettukuppam",
      "Kamatchi Hospital",
      "Echangadu",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Karaiyanchavadi",
      "Sholinganallur"
    ]
  },
  {
    "busNo": "154B",
    "start": "Poonamallee",
    "destination": "Nanganallur",
    "routeStops": "Kumanachavadi, Porur, Guindy,St.Thomas Mount,Vanuvampet",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumanachavadi",
      "Porur",
      "Guindy",
      "St.Thomas Mount",
      "Vanuvampet",
      "Nanganallur"
    ]
  },
  {
    "busNo": "562B",
    "start": "Poonamallee",
    "destination": "Ponneri",
    "routeStops": "Janappan chathram x Road, Karanodai, Red Hills, Puzhal, Ambattur OT, Avadi, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Janappan chathramx Road",
      "Karanodai",
      "Red Hills",
      "Puzhal",
      "Ambattur OT",
      "Avadi",
      "Karaiyanchavadi",
      "Ponneri"
    ]
  },
  {
    "busNo": "578P",
    "start": "Poonamallee",
    "destination": "Elampakkam",
    "routeStops": "Chembarambakkam, Irunkattukottai, Pennalur EB, Sriperumbudur, Mambakkam, Vadamangalam, Thirumangalam, S.V.Chatiram, Maduramangalam Koot road, Pudhupattu",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Chembarambakkam",
      "Irunkattukottai",
      "Pennalur EB",
      "Sriperumbudur",
      "Mambakkam",
      "Vadamangalam",
      "Thirumangalam",
      "S.V.Chatiram",
      "Maduramangalam Koot road",
      "Pudhupattu",
      "Elampakkam"
    ]
  },
  {
    "busNo": "580P",
    "start": "Poonamallee",
    "destination": "Periyapalayam",
    "routeStops": "Thirumazhisai, Vellavedu, Pudhuchatiram, Periyakottambedu, Kosavapalayam, Thiruninravur, Pakkam, Tamaraipakkam, Vadamadurai",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Pudhuchatiram",
      "Periyakottambedu",
      "Kosavapalayam",
      "Thiruninravur",
      "Pakkam",
      "Tamaraipakkam",
      "Vadamadurai",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "591C",
    "start": "Poonamallee",
    "destination": "Narasinprm M Koil",
    "routeStops": "Chembarambakkam, Chetipedu, Thandalam, Mannur, Kattukoot rd, Mappedu, Perambakkam",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Chembarambakkam",
      "Chetipedu",
      "Thandalam",
      "Mannur",
      "Kattukoot rd",
      "Mappedu",
      "Perambakkam",
      "Narasinprm M Koil"
    ]
  },
  {
    "busNo": "25G",
    "start": "Poonamallee",
    "destination": "Anna Square",
    "routeStops": "Kannaki Statue, V.House, Royapettah, Palmgrove, Liberty, Vadapalani, Porur, Iyyapanthangal, Kumananchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kannaki Statue",
      "V.House",
      "Royapettah",
      "Palmgrove",
      "Liberty",
      "Vadapalani",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Anna Square"
    ]
  },
  {
    "busNo": "53",
    "start": "Poonamallee",
    "destination": "Broadway",
    "routeStops": "Kumananchavadi, Mathruvayoil, Arumbakkam, Aminijikarai, KMC, Central R.S",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kumananchavadi",
      "Mathruvayoil",
      "Arumbakkam",
      "Aminijikarai",
      "KMC",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "M54",
    "start": "Poonamallee",
    "destination": "T.Nagar",
    "routeStops": "Saidepet, Guindy, Porur, Iyyapanthangal, Kumananchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Saidepet",
      "Guindy",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "T.Nagar"
    ]
  },
  {
    "busNo": "55J",
    "start": "Poonamallee",
    "destination": "Tambaram",
    "routeStops": "Kadapery, Thiruneermalai, Burma Colony, Vazhuthulapedu, Kundrathur Murugan koil, Kundrathur, Mangadu, Kumanan chavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Kadapery",
      "Thiruneermalai",
      "Burma Colony",
      "Vazhuthulapedu",
      "Kundrathur Murugan koil",
      "Kundrathur",
      "Mangadu",
      "Kumanan chavadi",
      "Tambaram"
    ]
  },
  {
    "busNo": "55K",
    "start": "Poonamallee",
    "destination": "Tambaram",
    "routeStops": "Tambaram Sanatorium, Chromepet, Pallavaram, Pammal Kamarajapuram, Thiruneermalai, Kundrathur Murugan koil, Kundrathur, Mangadu, Kumanan chavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Tambaram Sanatorium",
      "Chromepet",
      "Pallavaram",
      "Pammal Kamarajapuram",
      "Thiruneermalai",
      "Kundrathur Murugan koil",
      "Kundrathur",
      "Mangadu",
      "Kumanan chavadi",
      "Tambaram"
    ]
  },
  {
    "busNo": "65",
    "start": "Poonamallee",
    "destination": "Avadi",
    "routeStops": "Govardhanagiri, Mettupalayam, Kaduveti, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Govardhanagiri",
      "Mettupalayam",
      "Kaduveti",
      "Karaiyanchavadi",
      "Avadi"
    ]
  },
  {
    "busNo": "65B",
    "start": "Poonamallee",
    "destination": "Ambattur I.E",
    "routeStops": "Karayan chavadi, Seeneerkuppam, Goverdhangiri, Avadi Market, Avadi, Thirumullaivoyal, Ambathur OT, Canara bank, Dunlop, AMBIT Park",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Karayan chavadi",
      "Seeneerkuppam",
      "Goverdhangiri",
      "Avadi Market",
      "Avadi",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Canara bank",
      "Dunlop",
      "AMBIT Park",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "65E",
    "start": "Poonamallee",
    "destination": "Ambattur I.E",
    "routeStops": "Ambattur OT, Avadi, Kamaraj Nagar, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Ambattur OT",
      "Avadi",
      "Kamaraj Nagar",
      "Karaiyanchavadi",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "65K",
    "start": "Poonamallee",
    "destination": "Avadi",
    "routeStops": "Govardhanagiri, Mettupalayam Rd JN, Parivakkam Rd JN, Kaduveti, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Govardhanagiri",
      "Mettupalayam Rd JN",
      "Parivakkam Rd JN",
      "Kaduveti",
      "Karaiyanchavadi",
      "Avadi"
    ]
  },
  {
    "busNo": "66K",
    "start": "Poonamallee",
    "destination": "Kilkattalai",
    "routeStops": "Inchangadu, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Kumananchavadi, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Inchangadu",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Kumananchavadi",
      "Karaiyanchavadi",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "162",
    "start": "Poonamallee",
    "destination": "Madhavaram",
    "routeStops": "Koyambedu Junction, Mathuravoyal, Kumananchavadi, Karaiyanchavadi",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Koyambedu Junction",
      "Mathuravoyal",
      "Kumananchavadi",
      "Karaiyanchavadi",
      "Madhavaram"
    ]
  },
  {
    "busNo": "553K",
    "start": "Poonamallee",
    "destination": "Sriperumbudur",
    "routeStops": "Chembarambakkam, Thandalam Koot road, Irrungattukottai, Pennalur EB",
    "areaSection": "Poonamallee",
    "stops": [
      "Poonamallee",
      "Chembarambakkam",
      "Thandalam Koot road",
      "Irrungattukottai",
      "Pennalur EB",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "54B",
    "start": "Porur",
    "destination": "Saidapet",
    "routeStops": "Moulivakkam, Baikadai, Periyapannicherry, Kolapakkam, Manapakkam, Nandambakkam,Butt road, Kathipara, Guindy I.E, Little Mount",
    "areaSection": "Porur",
    "stops": [
      "Porur",
      "Moulivakkam",
      "Baikadai",
      "Periyapannicherry",
      "Kolapakkam",
      "Manapakkam",
      "Nandambakkam",
      "Butt road",
      "Kathipara",
      "Guindy I.E",
      "Little Mount",
      "Saidapet"
    ]
  },
  {
    "busNo": "M89",
    "start": "Porur",
    "destination": "Somangalam",
    "routeStops": "Kundrathur",
    "areaSection": "Porur",
    "stops": [
      "Porur",
      "Kundrathur",
      "Somangalam"
    ]
  },
  {
    "busNo": "52",
    "start": "Pozhichalur",
    "destination": "Broadway",
    "routeStops": "Pallavaram, Guindy, Saidapet, DMS, TVS, LIC, Central RS",
    "areaSection": "Pozhichalur",
    "stops": [
      "Pozhichalur",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "52H",
    "start": "Pozhichalur",
    "destination": "Manimangalam",
    "routeStops": "Pallavaram,Chromepet,Tambaram, Mudichur, Mannivakkam, Karasangal",
    "areaSection": "Pozhichalur",
    "stops": [
      "Pozhichalur",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Mudichur",
      "Mannivakkam",
      "Karasangal",
      "Manimangalam"
    ]
  },
  {
    "busNo": "52J",
    "start": "Pozhichalur",
    "destination": "Durga nagar",
    "routeStops": "Pallavaram, Chromepet, T.B.Sanatorium,",
    "areaSection": "Pozhichalur",
    "stops": [
      "Pozhichalur",
      "Pallavaram",
      "Chromepet",
      "T.B.Sanatorium",
      "Durga nagar"
    ]
  },
  {
    "busNo": "M52",
    "start": "Pozhichalur",
    "destination": "Guduvanchery",
    "routeStops": "Pallavaram,Chromepet,Tambaram, Perungalathur, Vandalor Zoo",
    "areaSection": "Pozhichalur",
    "stops": [
      "Pozhichalur",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Perungalathur",
      "Vandalor Zoo",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "M1P",
    "start": "Pozhichalur",
    "destination": "Thiruvanmiyur",
    "routeStops": "Velachery, Kilkattalai, Pallavaram, Pammal",
    "areaSection": "Pozhichalur",
    "stops": [
      "Pozhichalur",
      "Velachery",
      "Kilkattalai",
      "Pallavaram",
      "Pammal",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "52S",
    "start": "Pozhichalur",
    "destination": "Nemilicheri",
    "routeStops": "Chromepet, Pallavaram",
    "areaSection": "Pozhichalur",
    "stops": [
      "Pozhichalur",
      "Chromepet",
      "Pallavaram",
      "Nemilicheri"
    ]
  },
  {
    "busNo": "118P",
    "start": "Puzhuthiva kkam",
    "destination": "Guduvanchery",
    "routeStops": "Aadambakkam, Guindy,Pallavaram, Tambaram, Zoo",
    "areaSection": "Puzhuthivakkam",
    "stops": [
      "Puzhuthiva kkam",
      "Aadambakkam",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Zoo",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "51P",
    "start": "Puzhudiva kkam BS",
    "destination": "High Court",
    "routeStops": "Gunidy Race Course",
    "areaSection": "Puzhuthivakkam",
    "stops": [
      "Puzhudiva kkam BS",
      "Gunidy Race Course",
      "High Court"
    ]
  },
  {
    "busNo": "M270",
    "start": "Puzhuthiva kkam",
    "destination": "Ambattur I.E",
    "routeStops": "Aadambakkam, Guindy, Udhayam, CMBT, Thirumangalam",
    "areaSection": "Puzhuthivakkam",
    "stops": [
      "Puzhuthiva kkam",
      "Aadambakkam",
      "Guindy",
      "Udhayam",
      "CMBT",
      "Thirumangalam",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "554A",
    "start": "Puzhuthiva kkam",
    "destination": "Sriperumbudur",
    "routeStops": "Guindy, Porur, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "Puzhuthivakkam",
    "stops": [
      "Puzhuthiva kkam",
      "Guindy",
      "Porur",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "62A",
    "start": "Red Hills",
    "destination": "Ambattur I.E",
    "routeStops": "Pudur",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Pudur",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "62C",
    "start": "Red Hills",
    "destination": "SRMC(Porur)",
    "routeStops": "Iyyapanthangal, Kattupakkam, Kumanan chavadi, Saveetha Engineering College, Ayapakkam, Ambathur OT, Pudur, Kallikuppam, Puzhal, Bypass road, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Iyyapanthangal",
      "Kattupakkam",
      "Kumanan chavadi",
      "Saveetha Engineering College",
      "Ayapakkam",
      "Ambathur OT",
      "Pudur",
      "Kallikuppam",
      "Puzhal",
      "Bypass road",
      "Kavangarai",
      "Ayurveda Ashramam",
      "SRMC(Porur)"
    ]
  },
  {
    "busNo": "114",
    "start": "Red Hills",
    "destination": "Vandalur Zoo",
    "routeStops": "Tambaram, Pallavaram, Guindy, Ashok nagar, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Padi, Thathankuppam, Kolathur, Retteri, Puzhal, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Ashok nagar",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Padi",
      "Thathankuppam",
      "Kolathur",
      "Retteri",
      "Puzhal",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "114A",
    "start": "Red Hills",
    "destination": "Ayanavaram",
    "routeStops": "Puzhal, Nethaji Circle(byepass), Retteri, Lucas, ICF",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Puzhal",
      "Nethaji Circle(byepass)",
      "Retteri",
      "Lucas",
      "ICF",
      "Ayanavaram"
    ]
  },
  {
    "busNo": "157E",
    "start": "Red Hills",
    "destination": "Ennore",
    "routeStops": "Puzhal, Moolakadai,Sharma Nagar, M.K.B Nagar, Korukkupettai, Tondaripet, Tollgate, Theradi, Thiruvottiyur",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Puzhal",
      "Moolakadai",
      "Sharma Nagar",
      "M.K.B Nagar",
      "Korukkupettai",
      "Tondaripet",
      "Tollgate",
      "Theradi",
      "Thiruvottiyur",
      "Ennore"
    ]
  },
  {
    "busNo": "M157",
    "start": "Red Hills",
    "destination": "Thiruvottiyur",
    "routeStops": "Puzhal, Moolakadai,Sharma Nagar, M.K.B Nagar, Korukkupettai, Tondaripet, Tollgate, Theradi",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Puzhal",
      "Moolakadai",
      "Sharma Nagar",
      "M.K.B Nagar",
      "Korukkupettai",
      "Tondaripet",
      "Tollgate",
      "Theradi",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "242",
    "start": "Red Hills",
    "destination": "Broadway",
    "routeStops": "Central R.S, Vepery, Doveton, Perambur, Kolathur, Puzhal",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Chennai Central",
      "Vepery",
      "Doveton",
      "Perambur",
      "Kolathur",
      "Puzhal",
      "Broadway"
    ]
  },
  {
    "busNo": "242xt",
    "start": "Red Hills",
    "destination": "Anna Square",
    "routeStops": "",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Anna Square"
    ]
  },
  {
    "busNo": "505P",
    "start": "Red Hills",
    "destination": "Periyapalayam",
    "routeStops": "Alamadhi, Tamaraipakkam, Vengal, Vadamadurai",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Alamadhi",
      "Tamaraipakkam",
      "Vengal",
      "Vadamadurai",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "557C",
    "start": "Red Hills",
    "destination": "Kallur",
    "routeStops": "Karanodai, Thachur Koot Road, Puduvayal, Kavarapettai, Gummidipoondi R.S., Elavur, Kuppam, Chinna Mangodu",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Karanodai",
      "Thachur Koot Road",
      "Puduvayal",
      "Kavarapettai",
      "Gummidipoondi R.S.",
      "Elavur",
      "Kuppam",
      "Chinna Mangodu",
      "Kallur"
    ]
  },
  {
    "busNo": "557M",
    "start": "Red Hills",
    "destination": "Madarpakkam",
    "routeStops": "Karanodai, Thachur Koot Road, Puduvayal, Kavarapettai, Gummidipoondi, Equavarpalayam, Pathirivedu",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Karanodai",
      "Thachur Koot Road",
      "Puduvayal",
      "Kavarapettai",
      "Gummidipoondi",
      "Equavarpalayam",
      "Pathirivedu",
      "Madarpakkam"
    ]
  },
  {
    "busNo": "558M",
    "start": "Red Hills",
    "destination": "Minjur N.T.",
    "routeStops": "",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Minjur N.T."
    ]
  },
  {
    "busNo": "562A",
    "start": "Red Hills",
    "destination": "Sriperumbudur",
    "routeStops": "Puzhal, Pudur, Ambattur OT, Avadi, Karaiyanchavadi, Poonammallee, Irrunkatturkottai",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Puzhal",
      "Pudur",
      "Ambattur OT",
      "Avadi",
      "Karaiyanchavadi",
      "Poonammallee",
      "Irrunkatturkottai",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "592A",
    "start": "Red Hills",
    "destination": "Uthukkottai",
    "routeStops": "Karanodai, Thatchur Koot road,Kannigaipair, Periyapalayam",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Karanodai",
      "Thatchur Koot road",
      "Kannigaipair",
      "Periyapalayam",
      "Uthukkottai"
    ]
  },
  {
    "busNo": "558A",
    "start": "RedHills",
    "destination": "Minjur",
    "routeStops": "Karanodai",
    "areaSection": "Red Hills",
    "stops": [
      "RedHills",
      "Karanodai",
      "Minjur"
    ]
  },
  {
    "busNo": "57",
    "start": "Red Hills",
    "destination": "V Nagar",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "V Nagar"
    ]
  },
  {
    "busNo": "58A",
    "start": "Red Hills",
    "destination": "Broadway",
    "routeStops": "V.Nagar, Vyasarpadi, Moolakadai,",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "V.Nagar",
      "Vyasarpadi",
      "Moolakadai",
      "Broadway"
    ]
  },
  {
    "busNo": "61R",
    "start": "Red Hills",
    "destination": "Avadi",
    "routeStops": "HVF Hospital, Kovilpadagai, Vellanur, Veerapuram, Kadavoor",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "HVF Hospital",
      "Kovilpadagai",
      "Vellanur",
      "Veerapuram",
      "Kadavoor",
      "Avadi"
    ]
  },
  {
    "busNo": "62",
    "start": "Red Hills",
    "destination": "Avadi",
    "routeStops": "Thirumullaivoyal, Ambathur OT, Pudur, Kallikuppam, Surapedu, Puzhal, Bypass road, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Pudur",
      "Kallikuppam",
      "Surapedu",
      "Puzhal",
      "Bypass road",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Avadi"
    ]
  },
  {
    "busNo": "62",
    "start": "Red Hills",
    "destination": "Poonamallee",
    "routeStops": "Karayan chavadi, Seeneerkuppam, Goverdhangiri, Avadi Market, Avadi, Thirumullaivoyal, Ambathur OT, Pudur, Kallikuppam, Puzhal, Bypass road, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Karayan chavadi",
      "Seeneerkuppam",
      "Goverdhangiri",
      "Avadi Market",
      "Avadi",
      "Thirumullaivoyal",
      "Ambathur OT",
      "Pudur",
      "Kallikuppam",
      "Puzhal",
      "Bypass road",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Poonamallee"
    ]
  },
  {
    "busNo": "65H",
    "start": "Red Hills",
    "destination": "Avadi",
    "routeStops": "Pattabiram, Thirunindravur",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Pattabiram",
      "Thirunindravur",
      "Avadi"
    ]
  },
  {
    "busNo": "C70",
    "start": "Red Hills",
    "destination": "Guindy Estate",
    "routeStops": "Ashok nagar, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Padi, Thathankuppam, Kolathur, Retteri, Puzhal, Kavangarai, Ayurveda Ashramam",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Ashok nagar",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Padi",
      "Thathankuppam",
      "Kolathur",
      "Retteri",
      "Puzhal",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Guindy Estate"
    ]
  },
  {
    "busNo": "505",
    "start": "Red Hills",
    "destination": "Thiruvallur",
    "routeStops": "Alamadhi, Tamaraipakkam, Vishnuvakkam, Moolakarai, Ekkadu Kandigai",
    "areaSection": "Red Hills",
    "stops": [
      "Red Hills",
      "Alamadhi",
      "Tamaraipakkam",
      "Vishnuvakkam",
      "Moolakarai",
      "Ekkadu Kandigai",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "M2",
    "start": "Saidapet",
    "destination": "Ottiambakkam",
    "routeStops": "Velachery, Medavakkam",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Velachery",
      "Medavakkam",
      "Ottiambakkam"
    ]
  },
  {
    "busNo": "5R",
    "start": "Saidapet",
    "destination": "Velachery",
    "routeStops": "Guindy, N.G.O. Colony, St.Thomas Mount, Vanuvampet, Velachery MRTS",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Guindy",
      "N.G.O. Colony",
      "St.Thomas Mount",
      "Vanuvampet",
      "Velachery MRTS",
      "Velachery"
    ]
  },
  {
    "busNo": "M11",
    "start": "Saidapet",
    "destination": "Tambaram East",
    "routeStops": "Guindy, St.Thomas Mount, Kilkattalai, Kovilambakkam, Medavakkam Koot Road, Santhosapuram, Camp Road",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Guindy",
      "St.Thomas Mount",
      "Kilkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Santhosapuram",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "19B",
    "start": "Saidapet",
    "destination": "Kelambakkam",
    "routeStops": "IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, SIRUSERI",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "SIRUSERI",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "19B xt",
    "start": "Saidapet",
    "destination": "Thirupporur",
    "routeStops": "IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, SIRUSERI,Kelambakkam",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "SIRUSERI",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "51B",
    "start": "Saidapet",
    "destination": "Karanai",
    "routeStops": "Checkpost, Velachery, Narayanapuram, Pallikaranai, Medavakkam, Sithalapakkam koot road, Sithalapakkam, Arasan kazhani, Ottiyambakkam",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Checkpost",
      "Velachery",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Sithalapakkam koot road",
      "Sithalapakkam",
      "Arasan kazhani",
      "Ottiyambakkam",
      "Karanai"
    ]
  },
  {
    "busNo": "51E",
    "start": "Saidapet",
    "destination": "Madipakkam BS",
    "routeStops": "Velachery, Ram Nagar",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Velachery",
      "Ram Nagar",
      "Madipakkam BS"
    ]
  },
  {
    "busNo": "51S",
    "start": "Saidapet",
    "destination": "Tambaram East",
    "routeStops": "St.Thomas Mount, Madippakkam, Keelkattalai, Kovilambakkam, Medavakkam Koot Road, Kamarajapuram, Camp Road",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "St.Thomas Mount",
      "Madippakkam",
      "Keelkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Kamarajapuram",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "M51D",
    "start": "Saidapet",
    "destination": "Kelambakkam",
    "routeStops": "Velachery, Medavakkam, Ottiyambakkam, Karanai, Thalambur, Pudhupakkam, Chettinad Hospital",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Velachery",
      "Medavakkam",
      "Ottiyambakkam",
      "Karanai",
      "Thalambur",
      "Pudhupakkam",
      "Chettinad Hospital",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "54E",
    "start": "Saidapet",
    "destination": "Meppur",
    "routeStops": "Guindy, Ramapuram, Porur, Kumanan chavadi, Poonamallee",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Guindy",
      "Ramapuram",
      "Porur",
      "Kumanan chavadi",
      "Poonamallee",
      "Meppur"
    ]
  },
  {
    "busNo": "65A",
    "start": "Saidapet",
    "destination": "Muthapudupet",
    "routeStops": "Guindy, Porur, Kumananchavadi, Karaiyanchavadi, Avadi, HVF Hospital",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Guindy",
      "Porur",
      "Kumananchavadi",
      "Karaiyanchavadi",
      "Avadi",
      "HVF Hospital",
      "Muthapudupet"
    ]
  },
  {
    "busNo": "29B",
    "start": "Saidapet",
    "destination": "Perambur",
    "routeStops": "Otteri, Doveton, KMC, Chetpet, Sterling Road/College Road, Gemini, DMS, T.Nagar",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Otteri",
      "Doveton",
      "KMC",
      "Chetpet",
      "Sterling Road/College Road",
      "Gemini",
      "DMS",
      "T.Nagar",
      "Perambur"
    ]
  },
  {
    "busNo": "51H",
    "start": "Saidapet",
    "destination": "Tambaram East",
    "routeStops": "Velachery,Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "A51 cut",
    "start": "Saidapet",
    "destination": "Tambaram East",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Pallikkaranai, Velachery, Guindy Race Course",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "Tambaram East"
    ]
  },
  {
    "busNo": "54B",
    "start": "Saidapet",
    "destination": "Porur",
    "routeStops": "Moulivakkam, Baikadai, Periyapannicherry, Kolapakkam, Manapakkam, Nandambakkam,Butt road, Kathipara, Guindy I.E, Little Mount",
    "areaSection": "Saidapet",
    "stops": [
      "Saidapet",
      "Moulivakkam",
      "Baikadai",
      "Periyapannicherry",
      "Kolapakkam",
      "Manapakkam",
      "Nandambakkam",
      "Butt road",
      "Kathipara",
      "Guindy I.E",
      "Little Mount",
      "Porur"
    ]
  },
  {
    "busNo": "12C",
    "start": "Saligramam",
    "destination": "Mylapore",
    "routeStops": "Vadapalani, Rangarajapuram, Panagal Park, S.I.E.T, Adyar Gate, Mandaveli",
    "areaSection": "Saligramam",
    "stops": [
      "Saligramam",
      "Vadapalani",
      "Rangarajapuram",
      "Panagal Park",
      "S.I.E.T",
      "Adyar Gate",
      "Mandaveli",
      "Mylapore"
    ]
  },
  {
    "busNo": "17E",
    "start": "Saligramam",
    "destination": "Broadway",
    "routeStops": "Central, Chindatripet, Egmore, DPI, Sterling Road, Valluvarkottam, Liberty, Vadapalani",
    "areaSection": "Saligramam",
    "stops": [
      "Saligramam",
      "Central",
      "Chindatripet",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Broadway"
    ]
  },
  {
    "busNo": "M119",
    "start": "Semmenche ri",
    "destination": "Guindy",
    "routeStops": "Velachery,SRP,Perungudi",
    "areaSection": "Semmencheri",
    "stops": [
      "Semmenche ri",
      "Velachery",
      "SRP",
      "Perungudi",
      "Guindy"
    ]
  },
  {
    "busNo": "M119A",
    "start": "Semmenche ri",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Velachery, SRP, Perungudi",
    "areaSection": "Semmencheri",
    "stops": [
      "Semmenche ri",
      "Saidapet",
      "Velachery",
      "SRP",
      "Perungudi",
      "T.Nagar"
    ]
  },
  {
    "busNo": "M119B",
    "start": "Semmenche ri",
    "destination": "Guindy",
    "routeStops": "Saidapet,GandhiMandapam, Adyar,Thi ruvanmiyur",
    "areaSection": "Semmencheri",
    "stops": [
      "Semmenche ri",
      "Saidapet",
      "GandhiMandapam",
      "Adyar",
      "Thi ruvanmiyur",
      "Guindy"
    ]
  },
  {
    "busNo": "A19",
    "start": "Shozhingan allur",
    "destination": "Madhya Kailash",
    "routeStops": "Thoraippakkam, SRP, Tidel Park",
    "areaSection": "Shozhinganallur",
    "stops": [
      "Shozhingan allur",
      "Thoraippakkam",
      "SRP",
      "Tidel Park",
      "Madhya Kailash"
    ]
  },
  {
    "busNo": "M51",
    "start": "Sholinganal lur",
    "destination": "T. Nagar",
    "routeStops": "Velachery, Medavakkam",
    "areaSection": "Shozhinganallur",
    "stops": [
      "Sholinganal lur",
      "Velachery",
      "Medavakkam",
      "T. Nagar"
    ]
  },
  {
    "busNo": "M51",
    "start": "Sholinganal lur",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Velacherry, Pallikaranai, Medavakkam, Perumbakkam",
    "areaSection": "Shozhinganallur",
    "stops": [
      "Sholinganal lur",
      "Saidapet",
      "Velacherry",
      "Pallikaranai",
      "Medavakkam",
      "Perumbakkam",
      "T.Nagar"
    ]
  },
  {
    "busNo": "66S",
    "start": "Sholinganal lur",
    "destination": "Poonamallee",
    "routeStops": "Mettukuppam, Kamatchi Hospital, Echangadu, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Karaiyanchavadi",
    "areaSection": "Shozhinganallur",
    "stops": [
      "Sholinganal lur",
      "Mettukuppam",
      "Kamatchi Hospital",
      "Echangadu",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "553",
    "start": "Sriperumbu dur",
    "destination": "Broadway",
    "routeStops": "Central R.S, KMC, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Chennai Central",
      "KMC",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Broadway"
    ]
  },
  {
    "busNo": "553A",
    "start": "Sriperumbu dur",
    "destination": "CMBT",
    "routeStops": "Mathruvayoil, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Mathruvayoil",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "CMBT"
    ]
  },
  {
    "busNo": "553K",
    "start": "Sriperumbu dur",
    "destination": "Poonamallee",
    "routeStops": "Chembarambakkam, Thandalam Koot road, Irrungattukottai, Pennalur EB",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Chembarambakkam",
      "Thandalam Koot road",
      "Irrungattukottai",
      "Pennalur EB",
      "Poonamallee"
    ]
  },
  {
    "busNo": "554A",
    "start": "Sriperumbu dur",
    "destination": "Puzhuthivakkam",
    "routeStops": "Guindy, Porur, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Guindy",
      "Porur",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Puzhuthivakkam"
    ]
  },
  {
    "busNo": "578",
    "start": "Sriperumbu dur",
    "destination": "Kundrathur",
    "routeStops": "Mangadu, Kumananchavadi, Poonamallee, Chembarambakkam, Irrungattukottai",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Mangadu",
      "Kumananchavadi",
      "Poonamallee",
      "Chembarambakkam",
      "Irrungattukottai",
      "Kundrathur"
    ]
  },
  {
    "busNo": "578A",
    "start": "Sriperumbu dur",
    "destination": "Vadapalani",
    "routeStops": "Virugambakkam, Valasarawakkam, Porur, Kovoor, Kundrathur, Somangalam, Nallur, Sumtheramedu Koot road, Pillaipakkam, Pattunool Chatiram",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Virugambakkam",
      "Valasarawakkam",
      "Porur",
      "Kovoor",
      "Kundrathur",
      "Somangalam",
      "Nallur",
      "Sumtheramedu Koot road",
      "Pillaipakkam",
      "Pattunool Chatiram",
      "Vadapalani"
    ]
  },
  {
    "busNo": "583",
    "start": "Sriperumbu dur",
    "destination": "Tambaram",
    "routeStops": "Mudichur, Padappai, Serapanacherri, Oragadam, Vallakottai, Pondur",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Mudichur",
      "Padappai",
      "Serapanacherri",
      "Oragadam",
      "Vallakottai",
      "Pondur",
      "Tambaram"
    ]
  },
  {
    "busNo": "502",
    "start": "Sriperumbu dur",
    "destination": "Broadway",
    "routeStops": "Central R.S, LIC, Saidapet, Guindy, Porur, Kumananchavadi, Poonamallee, Irrungattukottai",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Chennai Central",
      "LIC",
      "Saidapet",
      "Guindy",
      "Porur",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Broadway"
    ]
  },
  {
    "busNo": "562A",
    "start": "Sriperumbu dur",
    "destination": "Red Hills",
    "routeStops": "Puzhal, Pudur, Ambattur OT, Avadi, Karaiyanchavadi, Poonammallee, Irrunkatturkottai",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Puzhal",
      "Pudur",
      "Ambattur OT",
      "Avadi",
      "Karaiyanchavadi",
      "Poonammallee",
      "Irrunkatturkottai",
      "Red Hills"
    ]
  },
  {
    "busNo": "565",
    "start": "Sriperumbu dur",
    "destination": "Pattabiram",
    "routeStops": "Avadi, Govardhanagiri, Karaiyanchavadi, Poonamallee, Irrunkatturkottai",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Avadi",
      "Govardhanagiri",
      "Karaiyanchavadi",
      "Poonamallee",
      "Irrunkatturkottai",
      "Pattabiram"
    ]
  },
  {
    "busNo": "583C",
    "start": "Sriperumbu dur",
    "destination": "Tambaram",
    "routeStops": "Mudichur, Mannivakkam, Karasangal, Manimangalam",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Mudichur",
      "Mannivakkam",
      "Karasangal",
      "Manimangalam",
      "Tambaram"
    ]
  },
  {
    "busNo": "583D",
    "start": "Sriperumbu dur",
    "destination": "Tambaram",
    "routeStops": "Old Perungalathur, Manimangalam, Mullai Nagar",
    "areaSection": "Sriperumbudhur",
    "stops": [
      "Sriperumbu dur",
      "Old Perungalathur",
      "Manimangalam",
      "Mullai Nagar",
      "Tambaram"
    ]
  },
  {
    "busNo": "554",
    "start": "Sunguvarch atiram",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Guindy, Porur, Kumananchavadi, Poonamallee, Irrungattukottai,Sriperumbudur",
    "areaSection": "Sunguvar Chathiram",
    "stops": [
      "Sunguvarch atiram",
      "Saidapet",
      "Guindy",
      "Porur",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur",
      "T. Nagar"
    ]
  },
  {
    "busNo": "525",
    "start": "Sunguvarch atiram",
    "destination": "Vadapalani",
    "routeStops": "Virugambakkam, Valasarawakkam, Porur, Poonamallee, Irrungattukottai, Sriperumbudur, Thirumangalam koot road,Mambakkam,Vadamangalam",
    "areaSection": "Sunguvar Chathiram",
    "stops": [
      "Sunguvarch atiram",
      "Virugambakkam",
      "Valasarawakkam",
      "Porur",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur",
      "Thirumangalam koot road",
      "Mambakkam",
      "Vadamangalam",
      "Vadapalani"
    ]
  },
  {
    "busNo": "549",
    "start": "Sunguvarch athiram",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, Guindy, Porur, Iyyapanthangal, Kumananchavadi, Poonamallee, Irungatukottai, Sriperumbudur",
    "areaSection": "Sunguvar Chathiram",
    "stops": [
      "Sunguvarch athiram",
      "Adyar",
      "Guindy",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Poonamallee",
      "Irungatukottai",
      "Sriperumbudur",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "554B",
    "start": "Sunguvarch atram",
    "destination": "Ekkaduthangal",
    "routeStops": "Porur, Kumananchavadi, Poonamallee, Irrungattukottai, Sriperumbudur",
    "areaSection": "Sunguvar Chathiram",
    "stops": [
      "Sunguvarch atram",
      "Porur",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur",
      "Ekkaduthangal"
    ]
  },
  {
    "busNo": "51F",
    "start": "Sunnabu kulathur",
    "destination": "T. Nagar",
    "routeStops": "Velachery",
    "areaSection": "Sunnambu Kolathur",
    "stops": [
      "Sunnabu kulathur",
      "Velachery",
      "T. Nagar"
    ]
  },
  {
    "busNo": "5A",
    "start": "T. Nagar",
    "destination": "Tambaram East",
    "routeStops": "Saidapet, Velachery, Medavakkam, Camp Road",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Velachery",
      "Medavakkam",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "5B",
    "start": "T. Nagar",
    "destination": "Mylapore",
    "routeStops": "Saidapet, Anna University, Adyar, Sathyastudio, Mandaveli",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "Mandaveli",
      "Mylapore"
    ]
  },
  {
    "busNo": "5G",
    "start": "T. Nagar",
    "destination": "Kannagi Nagar",
    "routeStops": "Saidapet, Velachery, Taramani, RMZ, Perugudi",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Velachery",
      "Taramani",
      "RMZ",
      "Perugudi",
      "Kannagi Nagar"
    ]
  },
  {
    "busNo": "A5",
    "start": "T. Nagar",
    "destination": "Balaji Nagar",
    "routeStops": "Saidapet, Velachery, Medavakkam, Kamarajapuram",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Velachery",
      "Medavakkam",
      "Kamarajapuram",
      "Balaji Nagar"
    ]
  },
  {
    "busNo": "7K",
    "start": "T.Nagar",
    "destination": "Taramani",
    "routeStops": "Saidapet, Anna university, CPT, WPT,Tidel park",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Anna university",
      "CPT",
      "WPT",
      "Tidel park",
      "Taramani"
    ]
  },
  {
    "busNo": "M7",
    "start": "T.Nagar",
    "destination": "Thiruvanmiyur",
    "routeStops": "Saidapet, Velachery, SRP Tools",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Velachery",
      "SRP Tools",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "M7A",
    "start": "T.Nagar",
    "destination": "Thiruvanmiyur",
    "routeStops": "Saidapet, Guindy, Velachery, IRT, SRP Tools",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Guindy",
      "Velachery",
      "IRT",
      "SRP Tools",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "9M",
    "start": "T.Nagar",
    "destination": "A.G.S Office Colony",
    "routeStops": "Saidapet, Guindy, NGO Colony, Brindavan nagar, Kakkan Bridge",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Guindy",
      "NGO Colony",
      "Brindavan nagar",
      "Kakkan Bridge",
      "A.G.S Office Colony"
    ]
  },
  {
    "busNo": "12",
    "start": "T.Nagar",
    "destination": "Vivekananda House",
    "routeStops": "Teynampet, Alwarpet, Luz, Chennai Citi Centre",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Teynampet",
      "Alwarpet",
      "Luz",
      "Chennai Citi Centre",
      "Vivekananda House"
    ]
  },
  {
    "busNo": "12A",
    "start": "T. Nagar",
    "destination": "Foreshore Estate",
    "routeStops": "Pondy bazaar,Alwarpet, Luz, Santhome",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Pondy bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "Foreshore Estate"
    ]
  },
  {
    "busNo": "M12A",
    "start": "T. Nagar",
    "destination": "Foreshore Estate",
    "routeStops": "Pondy bazaar,Alwarpet, Luz, Santhome",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Pondy bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "Foreshore Estate"
    ]
  },
  {
    "busNo": "13B",
    "start": "T. Nagar",
    "destination": "Triplicane",
    "routeStops": "Zambazzar, Express avenue, Royapettah, Gopalapuram playground, Thousand Lights, DMS, Pondy Bazzar, Panagal park",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Zambazzar",
      "Express avenue",
      "Royapettah",
      "Gopalapuram playground",
      "Thousand Lights",
      "DMS",
      "Pondy Bazzar",
      "Panagal park",
      "Triplicane"
    ]
  },
  {
    "busNo": "19B xt",
    "start": "T.Nagar",
    "destination": "Thaiyur Koman Nagar",
    "routeStops": "Saidapet, IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, SIRUSERI, Kelambakkam",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "SIRUSERI",
      "Kelambakkam",
      "Thaiyur Koman Nagar"
    ]
  },
  {
    "busNo": "19C",
    "start": "T. Nagar",
    "destination": "Okkiam Thorapakkam",
    "routeStops": "Saidapet, Madhya Kailash, Tidel park, SRP Tools, Perugudi",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Madhya Kailash",
      "Tidel park",
      "SRP Tools",
      "Perugudi",
      "Okkiam Thorapakkam"
    ]
  },
  {
    "busNo": "19H",
    "start": "T.Nagar",
    "destination": "Kanathur",
    "routeStops": "Saidapet, Anna university, Adyar, Thiruvanmiyur, Kottivakkam, Palavakkam, Neelangarai, Injambakkam, Uthandi",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Anna university",
      "Adyar",
      "Thiruvanmiyur",
      "Kottivakkam",
      "Palavakkam",
      "Neelangarai",
      "Injambakkam",
      "Uthandi",
      "Kanathur"
    ]
  },
  {
    "busNo": "19T",
    "start": "T.Nagar",
    "destination": "Thalambur",
    "routeStops": "Saidapet, SRP Tools, Sholinganallur, Navalur",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "SRP Tools",
      "Sholinganallur",
      "Navalur",
      "Thalambur"
    ]
  },
  {
    "busNo": "M19A",
    "start": "T. Nagar",
    "destination": "Kelambakkam",
    "routeStops": "Saidapet, Adyar, Thiruvanmiyur, Perungudi",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Perungudi",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "M19B",
    "start": "T. Nagar",
    "destination": "Kannagi Nagar",
    "routeStops": "Saidapet, Adyar, Thiruvanmiyur, Jain College, Perungudi",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Jain College",
      "Perungudi",
      "Kannagi Nagar"
    ]
  },
  {
    "busNo": "27C",
    "start": "T. Nagar",
    "destination": "Thiruverkadu",
    "routeStops": "Panagal park, Bharathinagar, Liberty, Power house, Vadapalani, MMDA Colony, CMBT, Koyambedu Market, Nerkundram, Maduravoyal, Vanagaram, Velappan chavadi",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Panagal park",
      "Bharathinagar",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT",
      "Koyambedu Market",
      "Nerkundram",
      "Maduravoyal",
      "Vanagaram",
      "Velappan chavadi",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "27C cut",
    "start": "T. Nagar",
    "destination": "Anna nagar West",
    "routeStops": "Panagal park, Bharathinagar, Liberty, Power house, Vadapalani, MMDA Colony, CMBT, Thirumangalam",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Panagal park",
      "Bharathinagar",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT",
      "Thirumangalam",
      "Anna nagar West"
    ]
  },
  {
    "busNo": "27T",
    "start": "T.Nagar",
    "destination": "Oragadam",
    "routeStops": "Ambattur OT, Ambattur I.E, Collector Nagar, CMBT, Vadapalani, Liberty, Bharathi nagar, Panagal park",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Ambattur OT",
      "Ambattur I.E",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Liberty",
      "Bharathi nagar",
      "Panagal park",
      "Oragadam"
    ]
  },
  {
    "busNo": "M45",
    "start": "T. Nagar",
    "destination": "Kilkattalai",
    "routeStops": "Saidapet, Velachery",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Velachery",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "47D cut",
    "start": "T.Nagar",
    "destination": "Korattur",
    "routeStops": "Adyar, T. Nagar, Sterling Road, Lucas",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Adyar",
      "T. Nagar",
      "Sterling Road",
      "Lucas",
      "Korattur"
    ]
  },
  {
    "busNo": "49R",
    "start": "T. Nagar",
    "destination": "Thiruverkadu",
    "routeStops": "Saidapet, Guindy, Ramapuram, Valasar awakkam, Maduravoyal,Velappan chavadi",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Guindy",
      "Ramapuram",
      "Valasar awakkam",
      "Maduravoyal",
      "Velappan chavadi",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "51B xt",
    "start": "T.Nagar",
    "destination": "Ottiyambakkam",
    "routeStops": "Saidapet, Checkpost, Velachery, Narayanapuram, Pallikaranai, Medavakkam, Sithalapakkam koot road, Sithalapakkam, Arasan kazhani",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Checkpost",
      "Velachery",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Sithalapakkam koot road",
      "Sithalapakkam",
      "Arasan kazhani",
      "Ottiyambakkam"
    ]
  },
  {
    "busNo": "51M",
    "start": "T. Nagar",
    "destination": "Madipakkam BS",
    "routeStops": "Saidapet, Guindy, NGO Colony, ST Thomas Mount, Vanuvampet, Madipakkam Koot road",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Guindy",
      "NGO Colony",
      "ST Thomas Mount",
      "Vanuvampet",
      "Madipakkam Koot road",
      "Madipakkam BS"
    ]
  },
  {
    "busNo": "51N",
    "start": "T.Nagar",
    "destination": "Moovarasampet",
    "routeStops": "Saidapet, Guindy, NGO Colony, ST Thomas Mount, Vanuvampet, Madipakkam Koot road",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Guindy",
      "NGO Colony",
      "ST Thomas Mount",
      "Vanuvampet",
      "Madipakkam Koot road",
      "Moovarasampet"
    ]
  },
  {
    "busNo": "M51",
    "start": "T. Nagar",
    "destination": "Sholinganallur",
    "routeStops": "Velachery, Medavakkam",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Velachery",
      "Medavakkam",
      "Sholinganallur"
    ]
  },
  {
    "busNo": "M51C",
    "start": "T. Nagar",
    "destination": "Ottiambakkam",
    "routeStops": "Velachery, MEDAVAKKAM, Perumbakkam",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Velachery",
      "MEDAVAKKAM",
      "Perumbakkam",
      "Ottiambakkam"
    ]
  },
  {
    "busNo": "M51V",
    "start": "T.Nagar",
    "destination": "Kolathur",
    "routeStops": "Velachery,Medavakkam,Sithalapakkam koot road,Kovilancherry,Madurapakkam,Po nmar,Mambakkam Rice mill, Mambakkam",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Velachery",
      "Medavakkam",
      "Sithalapakkam koot road",
      "Kovilancherry",
      "Madurapakkam",
      "Po nmar",
      "Mambakkam Rice mill",
      "Mambakkam",
      "Kolathur"
    ]
  },
  {
    "busNo": "M51",
    "start": "T.Nagar",
    "destination": "Sholinganallur",
    "routeStops": "Saidapet, Velacherry, Pallikaranai, Medavakkam, Perumbakkam",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Velacherry",
      "Pallikaranai",
      "Medavakkam",
      "Perumbakkam",
      "Sholinganallur"
    ]
  },
  {
    "busNo": "M51C",
    "start": "T.Nagar",
    "destination": "Ottiambakkam",
    "routeStops": "Arasan Kazhani, Nukkanpalayam, Perumbakkam, Medavakkam, Pallikaranai, Velacherry, Checkpost, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Arasan Kazhani",
      "Nukkanpalayam",
      "Perumbakkam",
      "Medavakkam",
      "Pallikaranai",
      "Velacherry",
      "Checkpost",
      "Saidapet",
      "Ottiambakkam"
    ]
  },
  {
    "busNo": "52F",
    "start": "T.Nagar",
    "destination": "Nemilicheri",
    "routeStops": "Chromepet,",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Chromepet",
      "Nemilicheri"
    ]
  },
  {
    "busNo": "54V",
    "start": "T.Nagar",
    "destination": "Veppampattu",
    "routeStops": "Sri ram Engg college,Perumalpattu, Ramasamy nagar, Periyakottambedu, Pudhuchatiram, Vellavedu,Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Sri ram Engg college",
      "Perumalpattu",
      "Ramasamy nagar",
      "Periyakottambedu",
      "Pudhuchatiram",
      "Vellavedu",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "Veppampattu"
    ]
  },
  {
    "busNo": "G54",
    "start": "T.Nagar",
    "destination": "Vellavedu",
    "routeStops": "Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "Vellavedu"
    ]
  },
  {
    "busNo": "M54",
    "start": "T.Nagar",
    "destination": "Poonamallee",
    "routeStops": "Saidepet, Guindy, Porur, Iyyapanthangal, Kumananchavadi",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidepet",
      "Guindy",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "88L",
    "start": "T.Nagar",
    "destination": "Periyar Colony",
    "routeStops": "Gunidy, Porur, Kundrathur",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Gunidy",
      "Porur",
      "Kundrathur",
      "Periyar Colony"
    ]
  },
  {
    "busNo": "G118",
    "start": "T.Nagar",
    "destination": "Kavanoor Koot Road",
    "routeStops": "Guindy, Pallavaram, Tambaram, Vandaloor Zoo, Guduvanchery",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Vandaloor Zoo",
      "Guduvanchery",
      "Kavanoor Koot Road"
    ]
  },
  {
    "busNo": "147",
    "start": "T.Nagar",
    "destination": "Madhavaram",
    "routeStops": "Moolakadai, Retteri, Thirumangalam, Rountana, Loyola College, Mahalingapuram, Panagal park",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "Rountana",
      "Loyola College",
      "Mahalingapuram",
      "Panagal park",
      "Madhavaram"
    ]
  },
  {
    "busNo": "147A",
    "start": "T.Nagar",
    "destination": "Mugappair East",
    "routeStops": "Anna Nagar",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Anna Nagar",
      "Mugappair East"
    ]
  },
  {
    "busNo": "147B",
    "start": "T.Nagar",
    "destination": "Mugappair West",
    "routeStops": "Anna Nagar",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Anna Nagar",
      "Mugappair West"
    ]
  },
  {
    "busNo": "147C",
    "start": "T.Nagar",
    "destination": "Ambattur O.T.",
    "routeStops": "Collector Nagar, Blue Star, Anna Hospital, Loyalla College, Sterling Road, Valluvar Kottam",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Collector Nagar",
      "Blue Star",
      "Anna Hospital",
      "Loyalla College",
      "Sterling Road",
      "Valluvar Kottam",
      "Ambattur O.T."
    ]
  },
  {
    "busNo": "147Cxt",
    "start": "T.Nagar",
    "destination": "Ayapakkam",
    "routeStops": "Ambattur I.E",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Ambattur I.E",
      "Ayapakkam"
    ]
  },
  {
    "busNo": "147S",
    "start": "T.Nagar",
    "destination": "Senthil Nagar",
    "routeStops": "Thirumullaivoyil, Ambattur OT, Collector Nagar, Roundtana, Loyallo College, Valluvar Kottam",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Thirumullaivoyil",
      "Ambattur OT",
      "Collector Nagar",
      "Roundtana",
      "Loyallo College",
      "Valluvar Kottam",
      "Senthil Nagar"
    ]
  },
  {
    "busNo": "147T",
    "start": "T.Nagar",
    "destination": "Mathur MMDA",
    "routeStops": "Madhavaram, Moolakadai, Retteri, Thirumangalam, Rountana, Loyola College, Mahalingapuram, Panagal park",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Madhavaram",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "Rountana",
      "Loyola College",
      "Mahalingapuram",
      "Panagal park",
      "Mathur MMDA"
    ]
  },
  {
    "busNo": "154",
    "start": "T. Nagar",
    "destination": "Pattur",
    "routeStops": "Mangadu, Iyyapanthangal, Porur, Ramapuram, St.Thomas Mount, Guindy, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Mangadu",
      "Iyyapanthangal",
      "Porur",
      "Ramapuram",
      "St.Thomas Mount",
      "Guindy",
      "Saidapet",
      "Pattur"
    ]
  },
  {
    "busNo": "519A",
    "start": "T. Nagar",
    "destination": "Aalathur IE",
    "routeStops": "Saidapet, Tidel park,Sholinganallur, Kelambakkam, Thirupporur",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Tidel park",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur",
      "Aalathur IE"
    ]
  },
  {
    "busNo": "576",
    "start": "T. Nagar",
    "destination": "Kanchipuram",
    "routeStops": "Saidepet, Guindy, Porur, Poonamallee, Irrungattukottai, Sriperumbudur, Sunguvarchathiram, Pillai chatiram, Kamakshi Temple",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidepet",
      "Guindy",
      "Porur",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur",
      "Sunguvarchathiram",
      "Pillai chatiram",
      "Kamakshi Temple",
      "Kanchipuram"
    ]
  },
  {
    "busNo": "582",
    "start": "T. Nagar",
    "destination": "Vallakkottai",
    "routeStops": "Saidapet, Guindy, Porur, Poonamallee, Sriperumbudur, Bhondur, Pattunul Chatiram",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Guindy",
      "Porur",
      "Poonamallee",
      "Sriperumbudur",
      "Bhondur",
      "Pattunul Chatiram",
      "Vallakkottai"
    ]
  },
  {
    "busNo": "599",
    "start": "T. Nagar",
    "destination": "Mamallapuram",
    "routeStops": "Saidapet, Adyar, Thiruvanmiyur, Injambakkam, Kovalam, Thiruvedanthai, Vadanemili",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam",
      "Thiruvedanthai",
      "Vadanemili",
      "Mamallapuram"
    ]
  },
  {
    "busNo": "51F",
    "start": "T. Nagar",
    "destination": "Sunnabu kulathur",
    "routeStops": "Velachery",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Velachery",
      "Sunnabu kulathur"
    ]
  },
  {
    "busNo": "B51",
    "start": "T. Nagar",
    "destination": "Tambaram East",
    "routeStops": "Camp Road, Santhosapuram, Medavakkam Koot Road, Kilkattalai, Madipakkam koot Road,Mount, Kathipara, Guindy",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Camp Road",
      "Santhosapuram",
      "Medavakkam Koot Road",
      "Kilkattalai",
      "Madipakkam koot Road",
      "Mount",
      "Kathipara",
      "Guindy",
      "Tambaram East"
    ]
  },
  {
    "busNo": "V51",
    "start": "T. Nagar",
    "destination": "TambaramWest",
    "routeStops": "Saidapet, Velachery, Ram Nagar, Madipakkam, Kilkattalai, Kovilambakkam, Medavakkam Koot Road, Kamarajapuram, Camp Road",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Velachery",
      "Ram Nagar",
      "Madipakkam",
      "Kilkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Kamarajapuram",
      "Camp Road",
      "TambaramWest"
    ]
  },
  {
    "busNo": "70P",
    "start": "T. Nagar",
    "destination": "Veppampattu",
    "routeStops": "Thirunindravur, Avadi, Ambattur OT, Collector Nagar, CMBT, Liberty",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Thirunindravur",
      "Avadi",
      "Ambattur OT",
      "Collector Nagar",
      "CMBT",
      "Liberty",
      "Veppampattu"
    ]
  },
  {
    "busNo": "V151",
    "start": "T. Nagar",
    "destination": "Tambaram East",
    "routeStops": "Saidapet, Velachery, Kamatchi Hospital, S.Kolathur, Kovilambakkam, Medavakkam Koot Road, Kamarajapuram, Camp Road",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Velachery",
      "Kamatchi Hospital",
      "S.Kolathur",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Kamarajapuram",
      "Camp Road",
      "Tambaram East"
    ]
  },
  {
    "busNo": "154A",
    "start": "T. Nagar",
    "destination": "Thirunindravur",
    "routeStops": "Kosavapalayam, Pudhuchatiram, Vellavedu, Thirumazhisai, Poonamallee, Kumananchavadi, Iyyapanthangal,",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Kosavapalayam",
      "Pudhuchatiram",
      "Vellavedu",
      "Thirumazhisai",
      "Poonamallee",
      "Kumananchavadi",
      "Iyyapanthangal",
      "Thirunindravur"
    ]
  },
  {
    "busNo": "500",
    "start": "T. Nagar",
    "destination": "Chengalpattu",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Tambaram, Pallavaram, Guindy, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "Chengalpattu"
    ]
  },
  {
    "busNo": "554",
    "start": "T. Nagar",
    "destination": "Sunguvarchatiram",
    "routeStops": "Saidapet, Guindy, Porur, Kumananchavadi, Poonamallee, Irrungattukottai,Sriperumbudur",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar",
      "Saidapet",
      "Guindy",
      "Porur",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur",
      "Sunguvarchatiram"
    ]
  },
  {
    "busNo": "5S",
    "start": "T.Nagar",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, Kotturpuram",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Adyar",
      "Kotturpuram",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "11",
    "start": "T.Nagar",
    "destination": "Broadway",
    "routeStops": "Panagal park, Vani mahal, Thousand Lights, TVS, Central R.S",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Panagal park",
      "Vani mahal",
      "Thousand Lights",
      "TVS",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "11A",
    "start": "T.Nagar",
    "destination": "Vallalar Nagar",
    "routeStops": "Annasalai, Central R.S, Parry's Corner, Stanley Hospital",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Annasalai",
      "Chennai Central",
      "Parry's Corner",
      "Stanley Hospital",
      "Vallalar Nagar"
    ]
  },
  {
    "busNo": "11A xt",
    "start": "T.Nagar",
    "destination": "M.K.B Nagar East",
    "routeStops": "Annasalai, Central R.S, Parry's Corner, Stanley Hospital, Vallalar nagar, Vysarpadi",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Annasalai",
      "Chennai Central",
      "Parry's Corner",
      "Stanley Hospital",
      "Vallalar nagar",
      "Vysarpadi",
      "M.K.B Nagar East"
    ]
  },
  {
    "busNo": "A11",
    "start": "T.Nagar",
    "destination": "Broadway",
    "routeStops": "Teynampet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Teynampet",
      "Broadway"
    ]
  },
  {
    "busNo": "G18",
    "start": "T.Nagar",
    "destination": "Guduvanchery",
    "routeStops": "Saidapet, Guindy, Pallavaram, Chromepet, Tambaram, Vandalur Zoo",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "G18 xt",
    "start": "T.Nagar",
    "destination": "Maraimalai nagar",
    "routeStops": "Saidapet, Guindy, Pallavaram, Chromepet, Tambaram, Vandalur Zoo, Guduvanchery",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery",
      "Maraimalai nagar"
    ]
  },
  {
    "busNo": "M18C",
    "start": "T.Nagar",
    "destination": "Kilkattalai",
    "routeStops": "Madipakkam Koot Road, Nanganallur, Guindy, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Madipakkam Koot Road",
      "Nanganallur",
      "Guindy",
      "Saidapet",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "28D",
    "start": "T.Nagar",
    "destination": "Thiruvottiyur",
    "routeStops": "Therady, Rajakadai, Tollgate, Tondiarpet, Vallalar nagar, Regal, Central, Zimson, LIC, TVS, Thousand Lights, DMS, Panagal park",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Therady",
      "Rajakadai",
      "Tollgate",
      "Tondiarpet",
      "Vallalar nagar",
      "Regal",
      "Central",
      "Zimson",
      "LIC",
      "TVS",
      "Thousand Lights",
      "DMS",
      "Panagal park",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "38J",
    "start": "T.Nagar",
    "destination": "Madhavaram",
    "routeStops": "Thapal Petti, Moolakadai, Sharma nagar, Vyasarpadi, Basin Bridge, Mint, Stanley, Beach R.S, Broadway, Central, LIC, TVS, DMS, Panagal Park",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Thapal Petti",
      "Moolakadai",
      "Sharma nagar",
      "Vyasarpadi",
      "Basin Bridge",
      "Mint",
      "Stanley",
      "Chennai Beach",
      "Broadway",
      "Central",
      "LIC",
      "TVS",
      "DMS",
      "Panagal Park",
      "Madhavaram"
    ]
  },
  {
    "busNo": "49B",
    "start": "T.Nagar",
    "destination": "Poonamallee",
    "routeStops": "Kumananchavadi, Mangadu, Porur, K.K. Nagar, Ashok Pillar",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Kumananchavadi",
      "Mangadu",
      "Porur",
      "K.K. Nagar",
      "Ashok Pillar",
      "Poonamallee"
    ]
  },
  {
    "busNo": "52C",
    "start": "T.Nagar",
    "destination": "Hasthinapuram",
    "routeStops": "Chromepet,Pallavaram, Guindy, Saidap et",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Saidap et",
      "Hasthinapuram"
    ]
  },
  {
    "busNo": "54P",
    "start": "T.Nagar",
    "destination": "Poonamallee",
    "routeStops": "Kumanan chavadi, Mangadu, Paraniputhur, Baikadai, Moulivakkam, Porur, Guindy, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Kumanan chavadi",
      "Mangadu",
      "Paraniputhur",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Guindy",
      "Saidapet",
      "Poonamallee"
    ]
  },
  {
    "busNo": "54S",
    "start": "T.Nagar",
    "destination": "Vadaku Malaiyambakkam",
    "routeStops": "Poonamallee, Kumanan chavadi, Iyyppanthangal, Porur, Guindy, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Poonamallee",
      "Kumanan chavadi",
      "Iyyppanthangal",
      "Porur",
      "Guindy",
      "Saidapet",
      "Vadaku Malaiyambakkam"
    ]
  },
  {
    "busNo": "M79",
    "start": "T.Nagar",
    "destination": "Padappai",
    "routeStops": "Samthuvapuram, Karasangal, Mannivakkam, Mudichur, Old Perugalathur, Tambaram, Chromepet, Pallavaram, Meenambakkam, Asharkana, Guindy, Little mount, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Samthuvapuram",
      "Karasangal",
      "Mannivakkam",
      "Mudichur",
      "Old Perugalathur",
      "Tambaram",
      "Chromepet",
      "Pallavaram",
      "Meenambakkam",
      "Asharkana",
      "Guindy",
      "Little mount",
      "Saidapet",
      "Padappai"
    ]
  },
  {
    "busNo": "88C cut",
    "start": "T.Nagar",
    "destination": "Kundrathur",
    "routeStops": "Sirukalathur, Kundrathur B.S, Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, DMS, TVS, Central R.S",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Sirukalathur",
      "Kundrathur B.S",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "Chennai Central",
      "Kundrathur"
    ]
  },
  {
    "busNo": "114T",
    "start": "T.Nagar",
    "destination": "Padiyanallur",
    "routeStops": "Panagal park, Liberty, Power house, Vadapalani Koil, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Kolathur, Retteri, Puzhal, Kavangarai, Ayurveda Ashramam, Red Hills",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani Koil",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Kolathur",
      "Retteri",
      "Puzhal",
      "Kavangarai",
      "Ayurveda Ashramam",
      "Red Hills",
      "Padiyanallur"
    ]
  },
  {
    "busNo": "M119A",
    "start": "T.Nagar",
    "destination": "Semmencheri",
    "routeStops": "Saidapet, Velachery, SRP, Perungudi",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Velachery",
      "SRP",
      "Perungudi",
      "Semmencheri"
    ]
  },
  {
    "busNo": "188K",
    "start": "T.Nagar",
    "destination": "Katrambakkam",
    "routeStops": "Kundrathur, Koovoor, Periyapannicherry,Baikadai, Moulivakkam, Porur, Manapakkam, Nandambakkam,Butt road, Kathipara, Guindy I.E, Little Mount, Saidapet",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Kundrathur",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Manapakkam",
      "Nandambakkam",
      "Butt road",
      "Kathipara",
      "Guindy I.E",
      "Little Mount",
      "Saidapet",
      "Katrambakkam"
    ]
  },
  {
    "busNo": "591",
    "start": "T.Nagar",
    "destination": "Perambakkam",
    "routeStops": "Guindy, Porur, Poonamallee, Thandalam, Mannur, Kattukoot rd, Mappedu, Koovam",
    "areaSection": "T.Nagar",
    "stops": [
      "T.Nagar",
      "Guindy",
      "Porur",
      "Poonamallee",
      "Thandalam",
      "Mannur",
      "Kattukoot rd",
      "Mappedu",
      "Koovam",
      "Perambakkam"
    ]
  },
  {
    "busNo": "597",
    "start": "T. Nagar/Ma ndaveli",
    "destination": "Thiruvallur",
    "routeStops": "Guindy, Iyypanthangal, Kumanan chavadi, Poonamallee, Thirumazhisai, Vellavedu, Nemam, Pudhuchatiram, Mettukandigai, Arnavoyal kuppam, Arnavoyal, Murkancherry, Manavalan Nagar",
    "areaSection": "T.Nagar",
    "stops": [
      "T. Nagar/Ma ndaveli",
      "Guindy",
      "Iyypanthangal",
      "Kumanan chavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Nemam",
      "Pudhuchatiram",
      "Mettukandigai",
      "Arnavoyal kuppam",
      "Arnavoyal",
      "Murkancherry",
      "Manavalan Nagar",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "18H",
    "start": "Tambaram",
    "destination": "Naduveerapattu",
    "routeStops": "Kannadapalayam, Pazhanthandalam Koot road, Ettayapuram, Somangalam Koot road",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Kannadapalayam",
      "Pazhanthandalam Koot road",
      "Ettayapuram",
      "Somangalam Koot road",
      "Naduveerapattu"
    ]
  },
  {
    "busNo": "18L",
    "start": "Tambaram",
    "destination": "Madambakkam",
    "routeStops": "Perugalathur, Vandaloor Zoo, Guduvanchery, Madambakkam koot road",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Perugalathur",
      "Vandaloor Zoo",
      "Guduvanchery",
      "Madambakkam koot road",
      "Madambakkam"
    ]
  },
  {
    "busNo": "18S",
    "start": "Tambaram",
    "destination": "Somangalam",
    "routeStops": "Kannadapalayam, Pazhanthandalam Koot road, Ettayapuram, Somangalam Koot road, Poonthandalam",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Kannadapalayam",
      "Pazhanthandalam Koot road",
      "Ettayapuram",
      "Somangalam Koot road",
      "Poonthandalam",
      "Somangalam"
    ]
  },
  {
    "busNo": "18S extn",
    "start": "Tambaram",
    "destination": "Nallur",
    "routeStops": "Kannadapalayam, Pazhanthandalam Koot road, Ettayapuram, Somangalam Koot road, Poonthandalam, Somangalam",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Kannadapalayam",
      "Pazhanthandalam Koot road",
      "Ettayapuram",
      "Somangalam Koot road",
      "Poonthandalam",
      "Somangalam",
      "Nallur"
    ]
  },
  {
    "busNo": "21G",
    "start": "Tambaram",
    "destination": "Broadway",
    "routeStops": "Anna Square, Mylapore, Mandaveli, Adyar Gate, Guindy",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Anna Square",
      "Mylapore",
      "Mandaveli",
      "Adyar Gate",
      "Guindy",
      "Broadway"
    ]
  },
  {
    "busNo": "51G",
    "start": "Tambaram",
    "destination": "Vengaivasal",
    "routeStops": "Camp Road, Rajakilpakkam, Madambakkam",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Camp Road",
      "Rajakilpakkam",
      "Madambakkam",
      "Vengaivasal"
    ]
  },
  {
    "busNo": "55",
    "start": "Tambaram",
    "destination": "Mannivakkam/ Vandalur Gate",
    "routeStops": "Old Perugalathur, Mudichur",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Old Perugalathur",
      "Mudichur",
      "Mannivakkam/ Vandalur Gate"
    ]
  },
  {
    "busNo": "55D",
    "start": "Tambaram",
    "destination": "Keerapakkam",
    "routeStops": "Perugalathur, Sadhanapuram, Nedugudram, Kolapakkam, Rathnamangalam, Kandigai",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Perugalathur",
      "Sadhanapuram",
      "Nedugudram",
      "Kolapakkam",
      "Rathnamangalam",
      "Kandigai",
      "Keerapakkam"
    ]
  },
  {
    "busNo": "55G",
    "start": "Tambaram",
    "destination": "Vengambakkam",
    "routeStops": "Perugalathur, Sadhanapuram, Nedugudram, Kolapakkam, Vengambakkam koot road",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Perugalathur",
      "Sadhanapuram",
      "Nedugudram",
      "Kolapakkam",
      "Vengambakkam koot road",
      "Vengambakkam"
    ]
  },
  {
    "busNo": "55J",
    "start": "Tambaram",
    "destination": "Poonamallee",
    "routeStops": "Kadapery, Thiruneermalai, Burma Colony, Vazhuthulapedu, Kundrathur Murugan koil, Kundrathur, Mangadu, Kumanan chavadi",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Kadapery",
      "Thiruneermalai",
      "Burma Colony",
      "Vazhuthulapedu",
      "Kundrathur Murugan koil",
      "Kundrathur",
      "Mangadu",
      "Kumanan chavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "55K",
    "start": "Tambaram",
    "destination": "Poonamallee",
    "routeStops": "Tambaram Sanatorium, Chromepet, Pallavaram, Pammal Kamarajapuram, Thiruneermalai, Kundrathur Murugan koil, Kundrathur, Mangadu, Kumanan chavadi",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Tambaram Sanatorium",
      "Chromepet",
      "Pallavaram",
      "Pammal Kamarajapuram",
      "Thiruneermalai",
      "Kundrathur Murugan koil",
      "Kundrathur",
      "Mangadu",
      "Kumanan chavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "118",
    "start": "Tambaram",
    "destination": "Maraimalai Nagar I.E",
    "routeStops": "Irumbuliyur, Perugalathur, Vandalur Gate, Vandalur Zoo,Oorapakkam School, Oorapakkam Tea shop,Guduvanchery, SRM University",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Irumbuliyur",
      "Perugalathur",
      "Vandalur Gate",
      "Vandalur Zoo",
      "Oorapakkam School",
      "Oorapakkam Tea shop",
      "Guduvanchery",
      "SRM University",
      "Maraimalai Nagar I.E"
    ]
  },
  {
    "busNo": "118K",
    "start": "Tambaram",
    "destination": "Kilakaranai Koot road",
    "routeStops": "Irumbuliyur, Perugalathur, Vandalur Gate, Vandalur Zoo,Oorapakkam School, Oorapakkam Tea shop,Guduvanchery, SRM University, Maraimalai nagar IE, Kilakaranai",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Irumbuliyur",
      "Perugalathur",
      "Vandalur Gate",
      "Vandalur Zoo",
      "Oorapakkam School",
      "Oorapakkam Tea shop",
      "Guduvanchery",
      "SRM University",
      "Maraimalai nagar IE",
      "Kilakaranai",
      "Kilakaranai Koot road"
    ]
  },
  {
    "busNo": "166",
    "start": "Tambaram",
    "destination": "Iyyappanthangal",
    "routeStops": "Ramachandra Hospital, Porur, Porur Powerhouse, Gerugumbakkam, Kovur, Moondram kattalai, Kundrathur, Anagaputtur, Pammal, Pallavaram, Chromepet",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Ramachandra Hospital",
      "Porur",
      "Porur Powerhouse",
      "Gerugumbakkam",
      "Kovur",
      "Moondram kattalai",
      "Kundrathur",
      "Anagaputtur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Iyyappanthangal"
    ]
  },
  {
    "busNo": "170",
    "start": "Tambaram",
    "destination": "Thiruverkadu",
    "routeStops": "CMBT, Vadapalani, Guindy, Pallavaram, Chromepet",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "170G",
    "start": "Tambaram",
    "destination": "Periyar Nagar",
    "routeStops": "",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Periyar Nagar"
    ]
  },
  {
    "busNo": "515",
    "start": "Tambaram",
    "destination": "Mamallapuram",
    "routeStops": "Vandalur Zoo, Kolapakkam, Vengambakkam, Rathinamangalam, Kandigai, Melkottaiyur, Kilkottaiyur, Mambakkam, Pudhupakkam, Kelambakkam, Kalavakkam, Thirupporur, Thandalam, Paiyanoor",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Vandalur Zoo",
      "Kolapakkam",
      "Vengambakkam",
      "Rathinamangalam",
      "Kandigai",
      "Melkottaiyur",
      "Kilkottaiyur",
      "Mambakkam",
      "Pudhupakkam",
      "Kelambakkam",
      "Kalavakkam",
      "Thirupporur",
      "Thandalam",
      "Paiyanoor",
      "Mamallapuram"
    ]
  },
  {
    "busNo": "555",
    "start": "Tambaram",
    "destination": "Thirupporur",
    "routeStops": "Vandalur,Kandigai,Kelambakkam",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Vandalur",
      "Kandigai",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "555M",
    "start": "Tambaram",
    "destination": "Thirupporur",
    "routeStops": "Kolapakkam, Mambakkam, Kayar, Vembedu",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Kolapakkam",
      "Mambakkam",
      "Kayar",
      "Vembedu",
      "Thirupporur"
    ]
  },
  {
    "busNo": "555N",
    "start": "Tambaram",
    "destination": "Thirupporur",
    "routeStops": "Guduvanchery",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Guduvanchery",
      "Thirupporur"
    ]
  },
  {
    "busNo": "566A",
    "start": "Tambaram",
    "destination": "Thiruvallur",
    "routeStops": "Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Kumanan chavadi, Poonamallee, Thirumazhisai, Vellavedu, Nemam, Pudhuchatiram, Mettukandigai, Arnavoyal kuppam, Arnavoyal, Murkancherry, Manavalan Nagar",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Kumanan chavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Nemam",
      "Pudhuchatiram",
      "Mettukandigai",
      "Arnavoyal kuppam",
      "Arnavoyal",
      "Murkancherry",
      "Manavalan Nagar",
      "Thiruvallur"
    ]
  },
  {
    "busNo": "579A",
    "start": "Tambaram",
    "destination": "Wallajabad",
    "routeStops": "Mudichur, Karasangal, Padappai, Oragadam Koot Road",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Mudichur",
      "Karasangal",
      "Padappai",
      "Oragadam Koot Road",
      "Wallajabad"
    ]
  },
  {
    "busNo": "583B",
    "start": "Tambaram",
    "destination": "Perambakkam",
    "routeStops": "Old Perungalathur, Manimangalam, Sriperumbudur, Kattu Koot road, Meppedu, Koovam",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Old Perungalathur",
      "Manimangalam",
      "Sriperumbudur",
      "Kattu Koot road",
      "Meppedu",
      "Koovam",
      "Perambakkam"
    ]
  },
  {
    "busNo": "583C",
    "start": "Tambaram",
    "destination": "Sriperumbudur",
    "routeStops": "Mudichur, Mannivakkam, Karasangal, Manimangalam",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Mudichur",
      "Mannivakkam",
      "Karasangal",
      "Manimangalam",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "583D",
    "start": "Tambaram",
    "destination": "Sriperumbudur",
    "routeStops": "Old Perungalathur, Manimangalam, Mullai Nagar",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Old Perungalathur",
      "Manimangalam",
      "Mullai Nagar",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "1B",
    "start": "Tambaram",
    "destination": "Thiruvottiyur",
    "routeStops": "Chromepet, Pallavaram, Guindy, Teynampet, D.M.S, L.I.C, Central R.S, Parry's Corner, Kalmandapam,",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Teynampet",
      "D.M.S",
      "L.I.C",
      "Chennai Central",
      "Parry's Corner",
      "Kalmandapam",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "1E",
    "start": "Tambaram",
    "destination": "Ennore",
    "routeStops": "Chromepet, Pallavaram, Guindy, Teynampet, D.M.S, L.I.C, Central R.S, Parry's Corner, Kalmandapam, Tollgate, Thiruvottiyur",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Teynampet",
      "D.M.S",
      "L.I.C",
      "Chennai Central",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Thiruvottiyur",
      "Ennore"
    ]
  },
  {
    "busNo": "M18",
    "start": "Tambaram",
    "destination": "Guduvanchery",
    "routeStops": "Vandalur Zoo/Arignar Anna Zoological Park",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Vandalur Zoo/Arignar Anna Zoological Park",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "21P",
    "start": "Tambaram",
    "destination": "Velachery",
    "routeStops": "Madipakkam, Kilkattalai, Eachangadu, Chromepet",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Madipakkam",
      "Kilkattalai",
      "Eachangadu",
      "Chromepet",
      "Velachery"
    ]
  },
  {
    "busNo": "66",
    "start": "Tambaram",
    "destination": "Poonamallee",
    "routeStops": "MEPZ, Chromepet, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Karaiyanchavadi",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "MEPZ",
      "Chromepet",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "66P",
    "start": "Tambaram",
    "destination": "Pattabiram",
    "routeStops": "Pallavaram, Kundrathur, Poonamallee,Parivakkam, Chittukadu,Thandarai",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Pallavaram",
      "Kundrathur",
      "Poonamallee",
      "Parivakkam",
      "Chittukadu",
      "Thandarai",
      "Pattabiram"
    ]
  },
  {
    "busNo": "70",
    "start": "Tambaram",
    "destination": "Avadi",
    "routeStops": "Ambattur, Padi, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Chennai Airport, Pallavaram, Chromepet",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Ambattur",
      "Padi",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Chennai Airport",
      "Pallavaram",
      "Chromepet",
      "Avadi"
    ]
  },
  {
    "busNo": "70C",
    "start": "Tambaram",
    "destination": "Koyambedu Market",
    "routeStops": "Vadapalani, Udhayam, Pallavaram, Tambaram",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Vadapalani",
      "Udhayam",
      "Pallavaram",
      "Tambaram",
      "Koyambedu Market"
    ]
  },
  {
    "busNo": "70G",
    "start": "Tambaram",
    "destination": "Ayanavaram",
    "routeStops": "Anna Nagar East, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Chennai Airport, Pallavaram, Chromepet",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Anna Nagar East",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Chennai Airport",
      "Pallavaram",
      "Chromepet",
      "Ayanavaram"
    ]
  },
  {
    "busNo": "70T",
    "start": "Tambaram",
    "destination": "Villivakkam",
    "routeStops": "Nadhamuni, Thirumangalam, CMBT, Vadapalani, Guindy, Pallavaram",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Nadhamuni",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Villivakkam"
    ]
  },
  {
    "busNo": "L70",
    "start": "Tambaram",
    "destination": "Menambedu",
    "routeStops": "Korattur, CMBT, Vadapalani, Udhayam Theater",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Korattur",
      "CMBT",
      "Vadapalani",
      "Udhayam Theater",
      "Menambedu"
    ]
  },
  {
    "busNo": "80",
    "start": "Tambaram",
    "destination": "Padappai",
    "routeStops": "Manimangalam",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Manimangalam",
      "Padappai"
    ]
  },
  {
    "busNo": "170B",
    "start": "Tambaram",
    "destination": "TVK Nagar",
    "routeStops": "Kolathur, Retteri, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Guindy, Pallavaram",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Kolathur",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy",
      "Pallavaram",
      "TVK Nagar"
    ]
  },
  {
    "busNo": "170P",
    "start": "Tambaram",
    "destination": "Pattabiram",
    "routeStops": "Avadi, Ambattur OT, Golden Flats, Thirumangalam, CMBT, Vadapalani, Pallavaram, Chromepet",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Avadi",
      "Ambattur OT",
      "Golden Flats",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Pallavaram",
      "Chromepet",
      "Pattabiram"
    ]
  },
  {
    "busNo": "266",
    "start": "Tambaram",
    "destination": "Avadi",
    "routeStops": "Govardhanagiri, Kaduveti, Karaiyanchavadi, Kumananchavadi, Mangadu, Kundrathur, Pallavaram",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Govardhanagiri",
      "Kaduveti",
      "Karaiyanchavadi",
      "Kumananchavadi",
      "Mangadu",
      "Kundrathur",
      "Pallavaram",
      "Avadi"
    ]
  },
  {
    "busNo": "M500",
    "start": "Tambaram",
    "destination": "Chengalpattu",
    "routeStops": "Singaperumal Koil, Maraimalai nagar IE, Guduvancherry, Vandalur Zoo, Perugalathur",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Singaperumal Koil",
      "Maraimalai nagar IE",
      "Guduvancherry",
      "Vandalur Zoo",
      "Perugalathur",
      "Chengalpattu"
    ]
  },
  {
    "busNo": "583",
    "start": "Tambaram",
    "destination": "Sriperumbudur",
    "routeStops": "Mudichur, Padappai, Serapanacherri, Oragadam, Vallakottai, Pondur",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Mudichur",
      "Padappai",
      "Serapanacherri",
      "Oragadam",
      "Vallakottai",
      "Pondur",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "583P",
    "start": "Tambaram",
    "destination": "Pondhur",
    "routeStops": "Serapanancherri, Padappai, Mannivakkam, Mudichur",
    "areaSection": "Tambaram",
    "stops": [
      "Tambaram",
      "Serapanancherri",
      "Padappai",
      "Mannivakkam",
      "Mudichur",
      "Pondhur"
    ]
  },
  {
    "busNo": "51A",
    "start": "Tambaram East",
    "destination": "Agaramthen",
    "routeStops": "Camp Road",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Agaramthen"
    ]
  },
  {
    "busNo": "51D",
    "start": "Tambaram East",
    "destination": "Broadway",
    "routeStops": "Convent, Camp road, Rajakilpakkam, Kozhipannai, Madambakkam, Jothi Nagar, Noothencherry, Vengaivasal, Santhosapuram, Medavakkam Koot road, Medavakkam, Pallikaranai, Velacherry, Saidapet, DMS, TVS, LIC,",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Convent",
      "Camp road",
      "Rajakilpakkam",
      "Kozhipannai",
      "Madambakkam",
      "Jothi Nagar",
      "Noothencherry",
      "Vengaivasal",
      "Santhosapuram",
      "Medavakkam Koot road",
      "Medavakkam",
      "Pallikaranai",
      "Velacherry",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Broadway"
    ]
  },
  {
    "busNo": "51H",
    "start": "Tambaram East",
    "destination": "Saidapet",
    "routeStops": "Velachery,Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Saidapet"
    ]
  },
  {
    "busNo": "51K",
    "start": "Tambaram East",
    "destination": "Navalur",
    "routeStops": "Camp Road, Zion School, Madambakkam,Sithalapakkam Koot road, Sithalapakkam, Ottiyambakkam, Karanai, Thalambur",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Zion School",
      "Madambakkam",
      "Sithalapakkam Koot road",
      "Sithalapakkam",
      "Ottiyambakkam",
      "Karanai",
      "Thalambur",
      "Navalur"
    ]
  },
  {
    "busNo": "51L",
    "start": "Tambaram East",
    "destination": "CMBT",
    "routeStops": "Vadapalani, Guindy, Velachery, Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Vadapalani",
      "Guindy",
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "CMBT"
    ]
  },
  {
    "busNo": "51T",
    "start": "Tambaram East",
    "destination": "Ponmar",
    "routeStops": "Camp road, Balaji nagar, Thiruvancherry, Paduvancherry, Agaram then, Kovilancherry, Madurapakkam",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp road",
      "Balaji nagar",
      "Thiruvancherry",
      "Paduvancherry",
      "Agaram then",
      "Kovilancherry",
      "Madurapakkam",
      "Ponmar"
    ]
  },
  {
    "busNo": "A51",
    "start": "Tambaram East",
    "destination": "High Court",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Pallikkaranai, Velachery, Guindy Race Course, DMS, LIC, Central R.S",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "DMS",
      "LIC",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "A51 cut",
    "start": "Tambaram East",
    "destination": "Saidapet",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Pallikkaranai, Velachery, Guindy Race Course",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "Saidapet"
    ]
  },
  {
    "busNo": "B51",
    "start": "Tambaram East",
    "destination": "T. Nagar",
    "routeStops": "Camp Road, Santhosapuram, Medavakkam Koot Road, Kilkattalai, Madipakkam koot Road,Mount, Kathipara, Guindy",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Santhosapuram",
      "Medavakkam Koot Road",
      "Kilkattalai",
      "Madipakkam koot Road",
      "Mount",
      "Kathipara",
      "Guindy",
      "T. Nagar"
    ]
  },
  {
    "busNo": "B51 cut",
    "start": "Tambaram East",
    "destination": "Saidapet",
    "routeStops": "Camp Road, Santhosapuram, Medavakkam Koot Road, Kilkattalai, Madipakkam koot Road,Mount, Kathipara, GuindyEstate",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Santhosapuram",
      "Medavakkam Koot Road",
      "Kilkattalai",
      "Madipakkam koot Road",
      "Mount",
      "Kathipara",
      "GuindyEstate",
      "Saidapet"
    ]
  },
  {
    "busNo": "T51",
    "start": "Tambaram East",
    "destination": "Thiruvanmiyur",
    "routeStops": "Camp Road, Medavakkam, Sholinganallur, Karappakkam, SRP, Tidel Park",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Medavakkam",
      "Sholinganallur",
      "Karappakkam",
      "SRP",
      "Tidel Park",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "T51 cut",
    "start": "Tambaram East",
    "destination": "Kannaki Nagar",
    "routeStops": "Camp Road, Medavakkam, Sholinganallur",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Camp Road",
      "Medavakkam",
      "Sholinganallur",
      "Kannaki Nagar"
    ]
  },
  {
    "busNo": "T151",
    "start": "Tambaram East",
    "destination": "Kovalam",
    "routeStops": "CampRoad, Medavakkam,Shozhinganallur, Navalur, Kelambakkam",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "CampRoad",
      "Medavakkam",
      "Shozhinganallur",
      "Navalur",
      "Kelambakkam",
      "Kovalam"
    ]
  },
  {
    "busNo": "V151",
    "start": "Tambaram East",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Velachery, Kamatchi Hospital, S.Kolathur, Kovilambakkam, Medavakkam Koot Road, Kamarajapuram, Camp Road",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Saidapet",
      "Velachery",
      "Kamatchi Hospital",
      "S.Kolathur",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Kamarajapuram",
      "Camp Road",
      "T. Nagar"
    ]
  },
  {
    "busNo": "M151K",
    "start": "Tambaram East",
    "destination": "Kannagi Nagar",
    "routeStops": "CampRoad, Medavakkam, Shozhinganallur, Okkiam",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "CampRoad",
      "Medavakkam",
      "Shozhinganallur",
      "Okkiam",
      "Kannagi Nagar"
    ]
  },
  {
    "busNo": "551A",
    "start": "Tambaram East",
    "destination": "Kelambakkam",
    "routeStops": "CampRoad, Medavakkam, Ponmar, Mambakkam, Pudupakkam, Chettinad Hospital",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "CampRoad",
      "Medavakkam",
      "Ponmar",
      "Mambakkam",
      "Pudupakkam",
      "Chettinad Hospital",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "5A",
    "start": "Tambaram East",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Velachery, Medavakkam, Camp Road",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Saidapet",
      "Velachery",
      "Medavakkam",
      "Camp Road",
      "T. Nagar"
    ]
  },
  {
    "busNo": "M11",
    "start": "Tambaram East",
    "destination": "Saidapet",
    "routeStops": "Guindy, St.Thomas Mount, Kilkattalai, Kovilambakkam, Medavakkam Koot Road, Santhosapuram, Camp Road",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Guindy",
      "St.Thomas Mount",
      "Kilkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Santhosapuram",
      "Camp Road",
      "Saidapet"
    ]
  },
  {
    "busNo": "M15 xt",
    "start": "Tambaram East",
    "destination": "Mylapore",
    "routeStops": "Adyar, Thiruvanmiyur, SRP Tools, Velachery, Pallikaranai, Medavakkam, Camp Road",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Adyar",
      "Thiruvanmiyur",
      "SRP Tools",
      "Velachery",
      "Pallikaranai",
      "Medavakkam",
      "Camp Road",
      "Mylapore"
    ]
  },
  {
    "busNo": "51S",
    "start": "Tambaram East",
    "destination": "Saidapet",
    "routeStops": "St.Thomas Mount, Madippakkam, Keelkattalai, Kovilambakkam, Medavakkam Koot Road,",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "St.Thomas Mount",
      "Madippakkam",
      "Keelkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Saidapet"
    ]
  },
  {
    "busNo": "PP51",
    "start": "Tambaram East",
    "destination": "High Court",
    "routeStops": "Selaiyur, Camp Road, Medavakkam, Pallikaranai, Velachery, Anna University, Adyar, Sathyastudio, MRC Nagar, Foreshore Estate, Santhome, AIR, Anna Square",
    "areaSection": "Tambaram East",
    "stops": [
      "Tambaram East",
      "Selaiyur",
      "Camp Road",
      "Medavakkam",
      "Pallikaranai",
      "Velachery",
      "Anna University",
      "Adyar",
      "Sathyastudio",
      "MRC Nagar",
      "Foreshore Estate",
      "Santhome",
      "AIR",
      "Anna Square",
      "High Court"
    ]
  },
  {
    "busNo": "C51",
    "start": "Tambaram West",
    "destination": "Adyar",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Sholinganallur, ECR, Injambakkam, Thiruvanmyur",
    "areaSection": "Tambaram West",
    "stops": [
      "Tambaram West",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Sholinganallur",
      "ECR",
      "Injambakkam",
      "Thiruvanmyur",
      "Adyar"
    ]
  },
  {
    "busNo": "C51 cut",
    "start": "Tambaram West",
    "destination": "Injambakkam",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Sholinganallur, ECR",
    "areaSection": "Tambaram West",
    "stops": [
      "Tambaram West",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Sholinganallur",
      "ECR",
      "Injambakkam"
    ]
  },
  {
    "busNo": "V51",
    "start": "Tambaram West",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Velachery, Ram Nagar, Madipakkam, Kilkattalai, Kovilambakkam, Medavakkam Koot Road, Kamarajapuram, Camp Road",
    "areaSection": "Tambaram West",
    "stops": [
      "Tambaram West",
      "Saidapet",
      "Velachery",
      "Ram Nagar",
      "Madipakkam",
      "Kilkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Kamarajapuram",
      "Camp Road",
      "T. Nagar"
    ]
  },
  {
    "busNo": "V51 cut",
    "start": "Tambaram West",
    "destination": "Velachery",
    "routeStops": "Ram Nagar, Madipakkam, Kilkattalai, Kovilambakkam, Medavakkam Koot Road, Kamarajapuram, Camp Road",
    "areaSection": "Tambaram West",
    "stops": [
      "Tambaram West",
      "Ram Nagar",
      "Madipakkam",
      "Kilkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Kamarajapuram",
      "Camp Road",
      "Velachery"
    ]
  },
  {
    "busNo": "T151K",
    "start": "Tambaram West",
    "destination": "Kovalam",
    "routeStops": "CampRoad, Medavakkam, Shozhinganallur,Panaiyur, Uthandi, Kanathur, Muttukadu",
    "areaSection": "Tambaram West",
    "stops": [
      "Tambaram West",
      "CampRoad",
      "Medavakkam",
      "Shozhinganallur",
      "Panaiyur",
      "Uthandi",
      "Kanathur",
      "Muttukadu",
      "Kovalam"
    ]
  },
  {
    "busNo": "21J cut",
    "start": "Tambaram West",
    "destination": "Velachery",
    "routeStops": "Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road, Poondi Bazar, Tambaram Sanatorium",
    "areaSection": "Tambaram West",
    "stops": [
      "Tambaram West",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Poondi Bazar",
      "Tambaram Sanatorium",
      "Velachery"
    ]
  },
  {
    "busNo": "M21",
    "start": "Tambaram West",
    "destination": "Velachery",
    "routeStops": "Narayanapuram, Pallikaranai, Medavakkam, Camp Road, Tambaram East",
    "areaSection": "Tambaram West",
    "stops": [
      "Tambaram West",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Camp Road",
      "Tambaram East",
      "Velachery"
    ]
  },
  {
    "busNo": "88C",
    "start": "Thandalam",
    "destination": "High Court",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, DMS, TVS, Central R.S",
    "areaSection": "Thandalam",
    "stops": [
      "Thandalam",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "562",
    "start": "Thandalam",
    "destination": "Ambattur Estate",
    "routeStops": "Periyapalayam, Red Hills, Puzhal, Pudur, Ambattur OT",
    "areaSection": "Thandalam",
    "stops": [
      "Thandalam",
      "Periyapalayam",
      "Red Hills",
      "Puzhal",
      "Pudur",
      "Ambattur OT",
      "Ambattur Estate"
    ]
  },
  {
    "busNo": "593",
    "start": "Thandalam",
    "destination": "Broadway",
    "routeStops": "Beach R.S,Stanley, Mint,Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Periyapalayam",
    "areaSection": "Thandalam",
    "stops": [
      "Thandalam",
      "Chennai Beach",
      "Stanley",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Periyapalayam",
      "Broadway"
    ]
  },
  {
    "busNo": "T29",
    "start": "Thiru vi ka nagar",
    "destination": "Thiruvanmiyur",
    "routeStops": "Venus, Perambur, Jamaliya, Egmore, L.I.C, Mylapore, Adyar",
    "areaSection": "Thiru Vi Ka Nagar",
    "stops": [
      "Thiru vi ka nagar",
      "Venus",
      "Perambur",
      "Jamaliya",
      "Egmore",
      "L.I.C",
      "Mylapore",
      "Adyar",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "48B",
    "start": "Thiru.Vi.Ka Nagar",
    "destination": "Ennore",
    "routeStops": "Venus, Perambur, Moolakadai, Madhavaram, Mathur Koot road, Manali Koot road, Sathyamoorthy nagar, Ernavoor, Ashok Leyeland",
    "areaSection": "Thiru Vi Ka Nagar",
    "stops": [
      "Thiru.Vi.Ka Nagar",
      "Venus",
      "Perambur",
      "Moolakadai",
      "Madhavaram",
      "Mathur Koot road",
      "Manali Koot road",
      "Sathyamoorthy nagar",
      "Ernavoor",
      "Ashok Leyeland",
      "Ennore"
    ]
  },
  {
    "busNo": "38C",
    "start": "TVK Nagar",
    "destination": "V House",
    "routeStops": "Venus, Perambur, Pattalam, Bhuvaneswari, Doveton, Choolai P.O, Central R.S, Simpson, Adam market, Triplicane P.O",
    "areaSection": "Thiru Vi Ka Nagar",
    "stops": [
      "TVK Nagar",
      "Venus",
      "Perambur",
      "Pattalam",
      "Bhuvaneswari",
      "Doveton",
      "Choolai P.O",
      "Chennai Central",
      "Simpson",
      "Adam market",
      "Triplicane P.O",
      "V House"
    ]
  },
  {
    "busNo": "170B",
    "start": "TVK Nagar",
    "destination": "Tambaram",
    "routeStops": "Kolathur, Retteri, Thirumangalam, CMBT, Vadapalani, Ashok Pillar, Guindy, Pallavaram",
    "areaSection": "Thiru Vi Ka Nagar",
    "stops": [
      "TVK Nagar",
      "Kolathur",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy",
      "Pallavaram",
      "Tambaram"
    ]
  },
  {
    "busNo": "46",
    "start": "TVK Nagar",
    "destination": "CMBT",
    "routeStops": "Perambur, Ayanavaram, ICF, Anna Nagar East, Arumbakkam",
    "areaSection": "Thiru Vi Ka Nagar",
    "stops": [
      "TVK Nagar",
      "Perambur",
      "Ayanavaram",
      "ICF",
      "Anna Nagar East",
      "Arumbakkam",
      "CMBT"
    ]
  },
  {
    "busNo": "170C",
    "start": "TVK Nagar",
    "destination": "Guindy Estate",
    "routeStops": "Kolathur, Retteri, Thirumangalam, CMBT, Vadapalani, Ashok Pillar",
    "areaSection": "Thiru Vi Ka Nagar",
    "stops": [
      "TVK Nagar",
      "Kolathur",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy Estate"
    ]
  },
  {
    "busNo": "155A",
    "start": "Thirumudi vakkam",
    "destination": "Broadway",
    "routeStops": "Thiruneermalai, Nagakeni, Pallavaram, Guindy, Saidape t, DMS, LIC, Central R.S",
    "areaSection": "Thirumudivakkam",
    "stops": [
      "Thirumudi vakkam",
      "Thiruneermalai",
      "Nagakeni",
      "Pallavaram",
      "Guindy",
      "Saidapet",
      "DMS",
      "LIC",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "22A",
    "start": "Thirunamiy ur",
    "destination": "Ambattur I.E",
    "routeStops": "Korattur, Lucas, Nathamuni, ICF, Ayanavaram, Kellys, Purasaiwakkam, Egmore, Triplicane,Ka nnagi statue, Santhome, AMS, Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thirunamiy ur",
      "Korattur",
      "Lucas",
      "Nathamuni",
      "ICF",
      "Ayanavaram",
      "Kellys",
      "Purasaiwakkam",
      "Egmore",
      "Triplicane",
      "Ka nnagi statue",
      "Santhome",
      "AMS",
      "Adyar",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "1C",
    "start": "Thiruvanmi yur",
    "destination": "Ennore",
    "routeStops": "Adyar, Mylapore, Royapettah, Parry's Corner, Kalmandapam, Tollgate, Rajakadai, Theradi, Azax, Ernavoor",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Rajakadai",
      "Theradi",
      "Azax",
      "Ernavoor",
      "Ennore"
    ]
  },
  {
    "busNo": "1D",
    "start": "Thiruvanmi yur",
    "destination": "Ennore",
    "routeStops": "Adyar, Mylapore, Royapettah, Parry's Corner, Kalmandapam, Thalankuppam",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Parry's Corner",
      "Kalmandapam",
      "Thalankuppam",
      "Ennore"
    ]
  },
  {
    "busNo": "A1",
    "start": "Thiruvanmi yur",
    "destination": "Chennai Central",
    "routeStops": "Adyar, Mylapore, Royapettah",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Chennai Central"
    ]
  },
  {
    "busNo": "M1",
    "start": "Thiruvanmi yur",
    "destination": "Kilkattalai",
    "routeStops": "SRP Tools, Velachery, Kaiveli, Ram Nagar, Madipakkam",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "SRP Tools",
      "Velachery",
      "Kaiveli",
      "Ram Nagar",
      "Madipakkam",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "T1",
    "start": "Thiruvanmi yur",
    "destination": "Royapuram M.C",
    "routeStops": "Adyar, Mylapore, Royapettah, Parry's Corner",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Parry's Corner",
      "Royapuram M.C"
    ]
  },
  {
    "busNo": "M1P",
    "start": "Thiruvanmi yur",
    "destination": "Pozhichalur",
    "routeStops": "Velachery, Kilkattalai, Pallavaram, Pammal",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Velachery",
      "Kilkattalai",
      "Pallavaram",
      "Pammal",
      "Pozhichalur"
    ]
  },
  {
    "busNo": "5S",
    "start": "Thiruvanmi yur",
    "destination": "T.Nagar",
    "routeStops": "Adyar, Kotturpuram",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Kotturpuram",
      "T.Nagar"
    ]
  },
  {
    "busNo": "6D",
    "start": "Thiruvanmi yur",
    "destination": "Tollgate",
    "routeStops": "Besant Nagar, Foreshore Estate, Parry's Corner",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Besant Nagar",
      "Foreshore Estate",
      "Parry's Corner",
      "Tollgate"
    ]
  },
  {
    "busNo": "6E",
    "start": "Thiruvanmi yur",
    "destination": "Tollgate",
    "routeStops": "Adyar, Foreshore Estate, Parry's Corner, Kasimedu",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Foreshore Estate",
      "Parry's Corner",
      "Kasimedu",
      "Tollgate"
    ]
  },
  {
    "busNo": "7S",
    "start": "Thiruvanmi yur",
    "destination": "Saidapet West",
    "routeStops": "SRP Tools, Velachery, Saidapet, CIT Nagar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "SRP Tools",
      "Velachery",
      "Saidapet",
      "CIT Nagar",
      "Saidapet West"
    ]
  },
  {
    "busNo": "21H Cut",
    "start": "Thiruvanmi yur",
    "destination": "Kelambakkam",
    "routeStops": "SRP Tools,Perungudi,Sholinganallur,Navalu r,Padur",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Padur",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "A21",
    "start": "Thiruvanmi yur",
    "destination": "Vandalur Zoo",
    "routeStops": "SRP Tools,Thorapakkam,Redial Road,Kamatchi Hospital, Eechangadu,Pallavaram, Chromepet, Tambaram, Perugalathur",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "SRP Tools",
      "Thorapakkam",
      "Redial Road",
      "Kamatchi Hospital",
      "Eechangadu",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Perugalathur",
      "Vandalur Zoo"
    ]
  },
  {
    "busNo": "V21",
    "start": "Thiruvanmi yur",
    "destination": "Guduvanchery",
    "routeStops": "SRP, Taramani, Velachery, Kamatchi Hospital, Chromepet, Tambaram",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "SRP",
      "Taramani",
      "Velachery",
      "Kamatchi Hospital",
      "Chromepet",
      "Tambaram",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "23M",
    "start": "Thiruvanmi yur",
    "destination": "CMBT",
    "routeStops": "Jayanthi, Adyar, Gandhi mandapam, Little mount, Saidapet, T.Nagar, Panagal park, Liberty, Power house, Vadapalani, MMDA Colony",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Jayanthi",
      "Adyar",
      "Gandhi mandapam",
      "Little mount",
      "Saidapet",
      "T.Nagar",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT"
    ]
  },
  {
    "busNo": "23M extn",
    "start": "Thiruvanmi yur",
    "destination": "Anna Nagar West",
    "routeStops": "Adyar, Gandhi mandapam, Little mount, Saidapet, T.Nagar, Panagal park, Liberty, Power house, Vadapalani, MMDA Colony, CMBT, Thirumangalam",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Gandhi mandapam",
      "Little mount",
      "Saidapet",
      "T.Nagar",
      "Panagal park",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT",
      "Thirumangalam",
      "Anna Nagar West"
    ]
  },
  {
    "busNo": "29G",
    "start": "Thiruvanmi yur",
    "destination": "Parvathy Nagar (Kodungaiyur)",
    "routeStops": "Moolakadai, Perambur, Doveton, Egmore, LIC, Royapettah, Mylapore, Mandaveli, Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Moolakadai",
      "Perambur",
      "Doveton",
      "Egmore",
      "LIC",
      "Royapettah",
      "Mylapore",
      "Mandaveli",
      "Adyar",
      "Parvathy Nagar (Kodungaiyur)"
    ]
  },
  {
    "busNo": "41G",
    "start": "Thiruvanmi yur",
    "destination": "Oragadam",
    "routeStops": "Amabattur OT, Ambathur IE, Wavin, Collector nagar, Thirumangalam, Anna nagar Rountana, Amijikarai, Taylors road, Sterling road, Gemini, Stella Maris College, Mylapore, Mandaveli, AMS, Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Amabattur OT",
      "Ambathur IE",
      "Wavin",
      "Collector nagar",
      "Thirumangalam",
      "Anna nagar Rountana",
      "Amijikarai",
      "Taylors road",
      "Sterling road",
      "Gemini",
      "Stella Maris College",
      "Mylapore",
      "Mandaveli",
      "AMS",
      "Adyar",
      "Oragadam"
    ]
  },
  {
    "busNo": "47",
    "start": "Thiruvanmi yur/Adyar",
    "destination": "Villivakkam",
    "routeStops": "T.Nagar, Valluvar Kottam, Pushpa nagar,Loyola college, Anna Nagar East",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur/Adyar",
      "T.Nagar",
      "Valluvar Kottam",
      "Pushpa nagar",
      "Loyola college",
      "Anna Nagar East",
      "Villivakkam"
    ]
  },
  {
    "busNo": "47A",
    "start": "Thiruvanmi yur/Besant Nagar",
    "destination": "ICF (Integral Coach Factory)",
    "routeStops": "Adyar, T.Nagar, Sterling Road, Taylors Road, New Avadi Road",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur/Besant Nagar",
      "Adyar",
      "T.Nagar",
      "Sterling Road",
      "Taylors Road",
      "New Avadi Road",
      "ICF (Integral Coach Factory)"
    ]
  },
  {
    "busNo": "47D",
    "start": "Thiruvanmi yur",
    "destination": "Avadi",
    "routeStops": "Adyar, T. Nagar, Sterling Road, Ambattur I.E",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "T. Nagar",
      "Sterling Road",
      "Ambattur I.E",
      "Avadi"
    ]
  },
  {
    "busNo": "47D",
    "start": "Thiruvanmi yur",
    "destination": "Ambathur O.T.",
    "routeStops": "Adyar, T. Nagar, Sterling Road, Ambattur I.E",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "T. Nagar",
      "Sterling Road",
      "Ambattur I.E",
      "Ambathur O.T."
    ]
  },
  {
    "busNo": "A47",
    "start": "Thiruvanmi yur",
    "destination": "Avadi",
    "routeStops": "Adyar, T.Nagar, Pushpa Nagar, Ambattur I.E",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "T.Nagar",
      "Pushpa Nagar",
      "Ambattur I.E",
      "Avadi"
    ]
  },
  {
    "busNo": "49",
    "start": "Thiruvanmi yur",
    "destination": "Iyyapanthangal",
    "routeStops": "Guindy, Porur",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Guindy",
      "Porur",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "49xt",
    "start": "Thiruvanmi yur",
    "destination": "Thiruverkadu",
    "routeStops": "Iyyapanthangal, Kumananchavadi, Velappanchavadi",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Velappanchavadi",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "A147",
    "start": "Thiruvanmi yur",
    "destination": "Avadi",
    "routeStops": "Adyar, T.Nagar, Pushpa Nagar, Ambattur I.E, Collector Nagar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "T.Nagar",
      "Pushpa Nagar",
      "Ambattur I.E",
      "Collector Nagar",
      "Avadi"
    ]
  },
  {
    "busNo": "523",
    "start": "Thiruvanmi yur",
    "destination": "Perunthandalam",
    "routeStops": "Perungudi,Sholinganallur,Kelambakka m, Thirupporur",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Perungudi",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur",
      "Perunthandalam"
    ]
  },
  {
    "busNo": "523A",
    "start": "Thiruvanmi yur",
    "destination": "Karumbakkam",
    "routeStops": "Perungudi, Sholinganallur, Kelambakkam, Thirupporur",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Perungudi",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur",
      "Karumbakkam"
    ]
  },
  {
    "busNo": "549",
    "start": "Thiruvanmi yur",
    "destination": "Sunguvarchathir am",
    "routeStops": "Adyar, Guindy, Porur, Iyyapanthangal, Kumananchavadi, Poonamallee, Irungatukottai, Sriperumbudur",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Guindy",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Poonamallee",
      "Irungatukottai",
      "Sriperumbudur",
      "Sunguvarchathir am"
    ]
  },
  {
    "busNo": "1A",
    "start": "Thiruvanmi yur",
    "destination": "Thiruvottiyur",
    "routeStops": "Adyar, Mylapore, Royapettah, Central R.S, Kalmandapam, Tollgate, Rajakadai, Theradi",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Chennai Central",
      "Kalmandapam",
      "Tollgate",
      "Rajakadai",
      "Theradi",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "4",
    "start": "Thiruvanmi yur",
    "destination": "Thiruvottiyur",
    "routeStops": "Adyar, Mylapore, Luz, Music Academy, Royapettah, LIC, Central R.S, Regal, Vallalar Nagar, Tondiarpet, Tollgate, Therady",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Adyar",
      "Mylapore",
      "Luz",
      "Music Academy",
      "Royapettah",
      "LIC",
      "Chennai Central",
      "Regal",
      "Vallalar Nagar",
      "Tondiarpet",
      "Tollgate",
      "Therady",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "M7",
    "start": "Thiruvanmi yur",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Velachery, SRP Tools",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Saidapet",
      "Velachery",
      "SRP Tools",
      "T.Nagar"
    ]
  },
  {
    "busNo": "M7A",
    "start": "Thiruvanmi yur",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Guindy, Velachery, IRT, SRP Tools",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Saidapet",
      "Guindy",
      "Velachery",
      "IRT",
      "SRP Tools",
      "T.Nagar"
    ]
  },
  {
    "busNo": "21D",
    "start": "Thiruvanmi yur",
    "destination": "Broadway",
    "routeStops": "Indira Nagar, Besant Nagar, Foreshore Estate, Anna Square",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Indira Nagar",
      "Besant Nagar",
      "Foreshore Estate",
      "Anna Square",
      "Broadway"
    ]
  },
  {
    "busNo": "23C xt",
    "start": "Thiruvanmi yur",
    "destination": "Korattur",
    "routeStops": "Lucas, Nathamuni, ICF, Ayanavaram, Purasaiwakkam, Egmore, LIC, TVS, Saidapet, Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Lucas",
      "Nathamuni",
      "ICF",
      "Ayanavaram",
      "Purasaiwakkam",
      "Egmore",
      "LIC",
      "TVS",
      "Saidapet",
      "Adyar",
      "Korattur"
    ]
  },
  {
    "busNo": "29C xt",
    "start": "Thiruvanmi yur",
    "destination": "Mathur MMDA",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, Perambur",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "Perambur",
      "Mathur MMDA"
    ]
  },
  {
    "busNo": "29L",
    "start": "Thiruvanmi yur",
    "destination": "Periyar Nagar",
    "routeStops": "Egmore, Teynampet, Saidapet, Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Egmore",
      "Teynampet",
      "Saidapet",
      "Adyar",
      "Periyar Nagar"
    ]
  },
  {
    "busNo": "T29",
    "start": "Thiruvanmi yur",
    "destination": "Thiru vi ka nagar",
    "routeStops": "Venus, Perambur, Jamaliya, Egmore, L.I.C, Mylapore, Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Venus",
      "Perambur",
      "Jamaliya",
      "Egmore",
      "L.I.C",
      "Mylapore",
      "Adyar",
      "Thiru vi ka nagar"
    ]
  },
  {
    "busNo": "D41",
    "start": "Thiruvanmi yur",
    "destination": "Ambattur O.T.",
    "routeStops": "Korattur, Lucas,Thirumangalam, Amijikarai, KMC, Chetpet,Sterling road, Gemini,Teynampet,Nandanam, Adyar Gate, Mandaveli, AMS, Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Korattur",
      "Lucas",
      "Thirumangalam",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "Sterling road",
      "Gemini",
      "Teynampet",
      "Nandanam",
      "Adyar Gate",
      "Mandaveli",
      "AMS",
      "Adyar",
      "Ambattur O.T."
    ]
  },
  {
    "busNo": "T51",
    "start": "Thiruvanmi yur",
    "destination": "Tambaram East",
    "routeStops": "Camp Road, Medavakkam, Sholinganallur, Karappakkam, SRP, Tidel Park",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Camp Road",
      "Medavakkam",
      "Sholinganallur",
      "Karappakkam",
      "SRP",
      "Tidel Park",
      "Tambaram East"
    ]
  },
  {
    "busNo": "M70",
    "start": "Thiruvanmi yur",
    "destination": "CMBT",
    "routeStops": "Vadapalani, Ashok nagar, Guindy, Checkpost, Velacherry, Taramani, SRP",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Checkpost",
      "Velacherry",
      "Taramani",
      "SRP",
      "CMBT"
    ]
  },
  {
    "busNo": "M70 xt",
    "start": "Thiruvanmi yur",
    "destination": "Anna Nagar West",
    "routeStops": "Thirumangalam, CMBT, Vadapalani, Ashok nagar, Guindy, Checkpost, Velacherry, Taramani, SRP tools, Jayanthi",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Checkpost",
      "Velacherry",
      "Taramani",
      "SRP tools",
      "Jayanthi",
      "Anna Nagar West"
    ]
  },
  {
    "busNo": "T242",
    "start": "Thiruvanmi yur",
    "destination": "Padiyanallur",
    "routeStops": "Puzhal, Retteri, Kolathur, Perambur, Doveton, Vepery, Central R.S, Broadway, Marina, Santhome,Adyar",
    "areaSection": "Thiruvanmiyur",
    "stops": [
      "Thiruvanmi yur",
      "Puzhal",
      "Retteri",
      "Kolathur",
      "Perambur",
      "Doveton",
      "Vepery",
      "Chennai Central",
      "Broadway",
      "Marina",
      "Santhome",
      "Adyar",
      "Padiyanallur"
    ]
  },
  {
    "busNo": "154A",
    "start": "Thirunindr avur",
    "destination": "T. Nagar",
    "routeStops": "Kosavapalayam, Pudhuchatiram, Vellavedu, Thirumazhisai, Poonamallee, Kumananchavadi, Iyyapanthangal, Porur, Guindy, Saidapet",
    "areaSection": "Thiru Nindravur",
    "stops": [
      "Thirunindr avur",
      "Kosavapalayam",
      "Pudhuchatiram",
      "Vellavedu",
      "Thirumazhisai",
      "Poonamallee",
      "Kumananchavadi",
      "Iyyapanthangal",
      "Porur",
      "Guindy",
      "Saidapet",
      "T. Nagar"
    ]
  },
  {
    "busNo": "54A",
    "start": "Thirunindr avur",
    "destination": "Poonamallee",
    "routeStops": "Thirumazhisai, Vellavedu, Pudhuchatiram, Periyakottambedu, Kosavapalayam",
    "areaSection": "Thiru Nindravur",
    "stops": [
      "Thirunindr avur",
      "Thirumazhisai",
      "Vellavedu",
      "Pudhuchatiram",
      "Periyakottambedu",
      "Kosavapalayam",
      "Poonamallee"
    ]
  },
  {
    "busNo": "71E",
    "start": "Thirunindr avur",
    "destination": "Broadway /Am battur I.E (NS)",
    "routeStops": "Central R.S, New Avadi road, Nadhamuni, Ambattur I.E, Ambattur OT, Avadi",
    "areaSection": "Thiru Nindravur",
    "stops": [
      "Thirunindr avur",
      "Chennai Central",
      "New Avadi road",
      "Nadhamuni",
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi",
      "Broadway /Am battur I.E (NS)"
    ]
  },
  {
    "busNo": "221H",
    "start": "Thirupporur",
    "destination": "Chennai Central",
    "routeStops": "LIC,DMS, Saidapet,IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, Sholinganallur, SIRUSERI, Kelambakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "LIC",
      "DMS",
      "Saidapet",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "Sholinganallur",
      "SIRUSERI",
      "Kelambakkam",
      "Chennai Central"
    ]
  },
  {
    "busNo": "568B",
    "start": "Thirupporur",
    "destination": "Velachery",
    "routeStops": "Sholinganallur, Kelambakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Sholinganallur",
      "Kelambakkam",
      "Velachery"
    ]
  },
  {
    "busNo": "517T",
    "start": "Thirupporur",
    "destination": "Pallavaram",
    "routeStops": "Eachangadu, Kovilambakkam, Medavakkam Koot Road, Sholinganallur, Kelambakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Eachangadu",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Sholinganallur",
      "Kelambakkam",
      "Pallavaram"
    ]
  },
  {
    "busNo": "519",
    "start": "Thirupporur",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Tidel park,Sholinganallur, Kelambakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Saidapet",
      "Tidel park",
      "Sholinganallur",
      "Kelambakkam",
      "T. Nagar"
    ]
  },
  {
    "busNo": "519 cut",
    "start": "Thirupporur",
    "destination": "Adyar",
    "routeStops": "SRP tools, Sholinganallur, Kelambakkam, Kalavakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "SRP tools",
      "Sholinganallur",
      "Kelambakkam",
      "Kalavakkam",
      "Adyar"
    ]
  },
  {
    "busNo": "521",
    "start": "Thirupporur",
    "destination": "Broadway, Chennai",
    "routeStops": "Marina,Thiruvanmiyur,Perungudi,Sholi nganallur,Kelambakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Marina",
      "Thiruvanmiyur",
      "Perungudi",
      "Sholi nganallur",
      "Kelambakkam",
      "Broadway, Chennai"
    ]
  },
  {
    "busNo": "552K",
    "start": "Thirupporur",
    "destination": "Kilkattalai",
    "routeStops": "Medavakkam, Sholinganallur, Kelamba kkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Medavakkam",
      "Sholinganallur",
      "Kelamba kkam",
      "Kilkattalai"
    ]
  },
  {
    "busNo": "555",
    "start": "Thirupporur",
    "destination": "Tambaram",
    "routeStops": "Vandalur,Kandigai,Kelambakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Vandalur",
      "Kandigai",
      "Kelambakkam",
      "Tambaram"
    ]
  },
  {
    "busNo": "555M",
    "start": "Thirupporur",
    "destination": "Tambaram",
    "routeStops": "Kolapakkam, Mambakkam, Kayar, Vembedu",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Kolapakkam",
      "Mambakkam",
      "Kayar",
      "Vembedu",
      "Tambaram"
    ]
  },
  {
    "busNo": "555N",
    "start": "Thirupporur",
    "destination": "Tambaram",
    "routeStops": "Guduvanchery",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Guduvanchery",
      "Tambaram"
    ]
  },
  {
    "busNo": "566",
    "start": "Thirupporur",
    "destination": "Kundrathur",
    "routeStops": "Anakaputhur, Pammal, Pallavaram, Chromepet, Tambaram Sanatorium, Tambaram, Vandalur, Kandigai, Mambakkam, Pudhupakkam, Chettinad Hospital, Kelambakkam",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Tambaram Sanatorium",
      "Tambaram",
      "Vandalur",
      "Kandigai",
      "Mambakkam",
      "Pudhupakkam",
      "Chettinad Hospital",
      "Kelambakkam",
      "Kundrathur"
    ]
  },
  {
    "busNo": "587",
    "start": "Thirupporur",
    "destination": "Broadway",
    "routeStops": "Marina,Thiruvamiyur,ECR,Kelambakka m",
    "areaSection": "Thirupporur",
    "stops": [
      "Thirupporur",
      "Marina",
      "Thiruvamiyur",
      "ECR",
      "Kelambakkam",
      "Broadway"
    ]
  },
  {
    "busNo": "505",
    "start": "Thiruvallur",
    "destination": "Red Hills",
    "routeStops": "Alamadhi, Tamaraipakkam, Vishnuvakkam, Moolakarai, Ekkadu Kandigai",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Alamadhi",
      "Tamaraipakkam",
      "Vishnuvakkam",
      "Moolakarai",
      "Ekkadu Kandigai",
      "Red Hills"
    ]
  },
  {
    "busNo": "571",
    "start": "Thiruvallur",
    "destination": "Broadway",
    "routeStops": "Central R.S, Taylors Road, Nadhamuni, Padi, Ambattur IE, Avadi, Thirunindravur, Vepampattu, Sevapet, Kakallur",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Chennai Central",
      "Taylors Road",
      "Nadhamuni",
      "Padi",
      "Ambattur IE",
      "Avadi",
      "Thirunindravur",
      "Vepampattu",
      "Sevapet",
      "Kakallur",
      "Broadway"
    ]
  },
  {
    "busNo": "572",
    "start": "Thiruvallur",
    "destination": "Ambattur I.E",
    "routeStops": "Ambattur OT, Avadi, Pattabiram, Thirunindravur, Veppampattu, Sevapet, Kakallur",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Ambattur OT",
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Veppampattu",
      "Sevapet",
      "Kakallur",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "572A",
    "start": "Thiruvallur",
    "destination": "Avadi",
    "routeStops": "Pattabiram, Thirunindravur, Veppampattu, Sevapet, Kakallur",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Pattabiram",
      "Thirunindravur",
      "Veppampattu",
      "Sevapet",
      "Kakallur",
      "Avadi"
    ]
  },
  {
    "busNo": "597",
    "start": "Thiruvallur",
    "destination": "T. Nagar/Mandav eli",
    "routeStops": "Guindy, Iyypanthangal, Kumanan chavadi, Poonamallee, Thirumazhisai, Vellavedu, Nemam, Pudhuchatiram, Mettukandigai, Arnavoyal kuppam, Arnavoyal, Murkancherry, Manavalan Nagar",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Guindy",
      "Iyypanthangal",
      "Kumanan chavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Nemam",
      "Pudhuchatiram",
      "Mettukandigai",
      "Arnavoyal kuppam",
      "Arnavoyal",
      "Murkancherry",
      "Manavalan Nagar",
      "T. Nagar/Mandav eli"
    ]
  },
  {
    "busNo": "566A",
    "start": "Thiruvallur",
    "destination": "Tambaram",
    "routeStops": "Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Kumanan chavadi, Poonamallee, Thirumazhisai, Vellavedu, Nemam, Pudhuchatiram, Mettukandigai, Arnavoyal kuppam, Arnavoyal, Murkancherry, Manavalan Nagar",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Kumanan chavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Nemam",
      "Pudhuchatiram",
      "Mettukandigai",
      "Arnavoyal kuppam",
      "Arnavoyal",
      "Murkancherry",
      "Manavalan Nagar",
      "Tambaram"
    ]
  },
  {
    "busNo": "583A",
    "start": "Thiruvallur",
    "destination": "Sriperumbudur",
    "routeStops": "Manavalan Nagar, Mel Nallathur, Kizh Nallathur,Polivakkam, Kattu Koot Road",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Manavalan Nagar",
      "Mel Nallathur",
      "Kizh Nallathur",
      "Polivakkam",
      "Kattu Koot Road",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "596",
    "start": "Thiruvallur",
    "destination": "CMBT",
    "routeStops": "Koyambedu, Nerkundram, Madhuravoyal, Kumanan chavadi, Poonamallee, Thirumazhisai, Vellavedu, Nemam, Pudhuchatiram, Mettukandigai, Arnavoyal kuppam, Arnavoyal, Murkancherry, Manavalan Nagar",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Koyambedu",
      "Nerkundram",
      "Madhuravoyal",
      "Kumanan chavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Vellavedu",
      "Nemam",
      "Pudhuchatiram",
      "Mettukandigai",
      "Arnavoyal kuppam",
      "Arnavoyal",
      "Murkancherry",
      "Manavalan Nagar",
      "CMBT"
    ]
  },
  {
    "busNo": "596P",
    "start": "Thiruvallur",
    "destination": "CMBT",
    "routeStops": "Koyambedu, Nerkundram, Madhuravoyal, Kumanan chavadi, Poonamallee, Chembarabakkam, TSR Rajalakshmi Nagar, Mannur, Puduvallur Jn., Sunnabukulam, Aranvoyal, Manavalan Nagar",
    "areaSection": "Thiruvallur",
    "stops": [
      "Thiruvallur",
      "Koyambedu",
      "Nerkundram",
      "Madhuravoyal",
      "Kumanan chavadi",
      "Poonamallee",
      "Chembarabakkam",
      "TSR Rajalakshmi Nagar",
      "Mannur",
      "Puduvallur Jn.",
      "Sunnabukulam",
      "Aranvoyal",
      "Manavalan Nagar",
      "CMBT"
    ]
  },
  {
    "busNo": "M170",
    "start": "Thiruverka du",
    "destination": "Velachery",
    "routeStops": "Velappan chavadi, Vanagaram, Maduravoyal, Nerkundram, Koyambedu Market, CMBT, Vadapalani, Ashok Pillar, Guindy, Checkpost",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Velappan chavadi",
      "Vanagaram",
      "Maduravoyal",
      "Nerkundram",
      "Koyambedu Market",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy",
      "Checkpost",
      "Velachery"
    ]
  },
  {
    "busNo": "20K",
    "start": "Thiruverka du",
    "destination": "Ambattur I.E",
    "routeStops": "",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "20T",
    "start": "Thiruverka du",
    "destination": "Villivakkam",
    "routeStops": "Ambattur I.E, Ayapakkam",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Ambattur I.E",
      "Ayapakkam",
      "Villivakkam"
    ]
  },
  {
    "busNo": "27C",
    "start": "Thiruverka du",
    "destination": "T. Nagar",
    "routeStops": "Panagal park, Bharathinagar, Liberty, Power house, Vadapalani, MMDA Colony, CMBT, Koyambedu Market, Nerkundram, Maduravoyal, Vanagaram, Velappan chavadi",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Panagal park",
      "Bharathinagar",
      "Liberty",
      "Power house",
      "Vadapalani",
      "MMDA Colony",
      "CMBT",
      "Koyambedu Market",
      "Nerkundram",
      "Maduravoyal",
      "Vanagaram",
      "Velappan chavadi",
      "T. Nagar"
    ]
  },
  {
    "busNo": "29E",
    "start": "Thiruverka du",
    "destination": "Perambur",
    "routeStops": "Otteri, Purasawakkam High Road, Kellys, Aminjikarai, Koyambedu, Nerkundram, Maduravoyal, Velappanchavadi",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Otteri",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Koyambedu",
      "Nerkundram",
      "Maduravoyal",
      "Velappanchavadi",
      "Perambur"
    ]
  },
  {
    "busNo": "49R",
    "start": "Thiruverka du",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Guindy, Ramapuram, Valasar awakkam, Maduravoyal,Velappan chavadi",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Saidapet",
      "Guindy",
      "Ramapuram",
      "Valasar awakkam",
      "Maduravoyal",
      "Velappan chavadi",
      "T. Nagar"
    ]
  },
  {
    "busNo": "50",
    "start": "Thiruverka du",
    "destination": "Broadway",
    "routeStops": "Central, Dasaprakash, KMC, Amijikarai, Arumbakkam, Koyambedu, Nerkundram, Maduravoyal, Vanagaram, Velappan chavadi",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Central",
      "Dasaprakash",
      "KMC",
      "Amijikarai",
      "Arumbakkam",
      "Koyambedu",
      "Nerkundram",
      "Maduravoyal",
      "Vanagaram",
      "Velappan chavadi",
      "Broadway"
    ]
  },
  {
    "busNo": "59",
    "start": "Thiruverka du",
    "destination": "V Nagar",
    "routeStops": "Basinbridge, Elephantgate, Doveton, Purasawakam, KMC, Aminjikarai, Arumbakkam, Maduravoyal, Velappanchavadi",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Basinbridge",
      "Elephantgate",
      "Doveton",
      "Purasawakam",
      "KMC",
      "Aminjikarai",
      "Arumbakkam",
      "Maduravoyal",
      "Velappanchavadi",
      "V Nagar"
    ]
  },
  {
    "busNo": "127B",
    "start": "Thiruverka du",
    "destination": "Anna Square",
    "routeStops": "Maduravoyal, KoyambeduMarket, Amijikarai, KMC, Chetpet, EgmoreR.S, Chindhatripet, Triplicane",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Maduravoyal",
      "KoyambeduMarket",
      "Amijikarai",
      "KMC",
      "Chetpet",
      "EgmoreR.S",
      "Chindhatripet",
      "Triplicane",
      "Anna Square"
    ]
  },
  {
    "busNo": "159",
    "start": "Thiruverka du",
    "destination": "Thiruvottiyur",
    "routeStops": "Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Koyambedu, Nerkundram, Maduravoyal, Velappanchavadi",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Koyambedu",
      "Nerkundram",
      "Maduravoyal",
      "Velappanchavadi",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "170",
    "start": "Thiruverka du",
    "destination": "Tambaram",
    "routeStops": "CMBT, Vadapalani, Guindy, Pallavaram, Chromepet",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram"
    ]
  },
  {
    "busNo": "T553",
    "start": "Thiruverka du",
    "destination": "Kunnam",
    "routeStops": "Kumananchavadi, Poonamallee, Irrungattukottai, Sriperumbudur, Sung uvarchatiram",
    "areaSection": "Thiruverkadu",
    "stops": [
      "Thiruverka du",
      "Kumananchavadi",
      "Poonamallee",
      "Irrungattukottai",
      "Sriperumbudur",
      "Sung uvarchatiram",
      "Kunnam"
    ]
  },
  {
    "busNo": "1",
    "start": "Thiruvottiy ur",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, Mylapore, Royapettah, Parry's Corner, Kalmandapam, Tollgate, Rajaka dai, Theradi",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Rajaka dai",
      "Theradi",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "1B",
    "start": "Thiruvottiy ur",
    "destination": "Tambaram",
    "routeStops": "Chromepet, Pallavaram, Guindy, Teynampet, D.M.S, L.I.C, Central R.S, Parry's Corner, Kalmandapam, Tollgate",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Chromepet",
      "Pallavaram",
      "Guindy",
      "Teynampet",
      "D.M.S",
      "L.I.C",
      "Chennai Central",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Tambaram"
    ]
  },
  {
    "busNo": "1G",
    "start": "Thiruvottiy ur",
    "destination": "Velachery",
    "routeStops": "Saidapet, Annasalai, Parry's Corner, Kalmandapam, Tollgate",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Saidapet",
      "Annasalai",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Velachery"
    ]
  },
  {
    "busNo": "1G xt",
    "start": "Thiruvottiy ur",
    "destination": "Medavakkam",
    "routeStops": "Velachery, Saidapet, TVS, LIC, Parry's Corner, Kalmandapam, Tollgate",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Velachery",
      "Saidapet",
      "TVS",
      "LIC",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Medavakkam"
    ]
  },
  {
    "busNo": "1J",
    "start": "Thiruvottiy ur",
    "destination": "Triplicane",
    "routeStops": "Rajakadai, Tollgate, Kalmandappam, Pa rry's Corner, Central R.S",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Rajakadai",
      "Tollgate",
      "Kalmandappam",
      "Pa rry's Corner",
      "Chennai Central",
      "Triplicane"
    ]
  },
  {
    "busNo": "4",
    "start": "Thiruvottiy ur",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, Mylapore, Luz, Music Academy, Royapettah, LIC, Central R.S, Regal, Vallalar Nagar, Tondiarpet, Tollgate, Therady",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Adyar",
      "Mylapore",
      "Luz",
      "Music Academy",
      "Royapettah",
      "LIC",
      "Chennai Central",
      "Regal",
      "Vallalar Nagar",
      "Tondiarpet",
      "Tollgate",
      "Therady",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "21H xt",
    "start": "Thiruvotriy ur",
    "destination": "Kelambakkam",
    "routeStops": "Tollgate, Broadway, Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools,Perungudi,Sholinganallur,Navalu r",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvotriy ur",
      "Tollgate",
      "Broadway",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "28D",
    "start": "Thiruvottiy ur",
    "destination": "T.Nagar",
    "routeStops": "Therady, Rajakadai, Tollgate, Tondiarpet, Vallalar nagar, Regal, Central, Zimson, LIC, TVS, Thousand Lights, DMS, Panagal park",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Therady",
      "Rajakadai",
      "Tollgate",
      "Tondiarpet",
      "Vallalar nagar",
      "Regal",
      "Central",
      "Zimson",
      "LIC",
      "TVS",
      "Thousand Lights",
      "DMS",
      "Panagal park",
      "T.Nagar"
    ]
  },
  {
    "busNo": "34",
    "start": "Thiruvottiy ur",
    "destination": "Ambattur I.E",
    "routeStops": "Thirumangalam, Rountana, Chinthamani, Kellys, Purasaiwakkam, Choolai P.O., Regal, V.Nagar, Tondiarpet, Tollgate, Therady",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Thirumangalam",
      "Rountana",
      "Chinthamani",
      "Kellys",
      "Purasaiwakkam",
      "Choolai P.O.",
      "Regal",
      "V.Nagar",
      "Tondiarpet",
      "Tollgate",
      "Therady",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "34xt",
    "start": "Thiruvottiy ur",
    "destination": "Pattabiram",
    "routeStops": "Ambattur I.E, Thirumangalam, Rountana, Chinthamani, Kellys, Purasaiwakkam, Choolai P.O., Regal, V.Nagar, Tondiarpet, Tollgate, Therady",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Ambattur I.E",
      "Thirumangalam",
      "Rountana",
      "Chinthamani",
      "Kellys",
      "Purasaiwakkam",
      "Choolai P.O.",
      "Regal",
      "V.Nagar",
      "Tondiarpet",
      "Tollgate",
      "Therady",
      "Pattabiram"
    ]
  },
  {
    "busNo": "119",
    "start": "Thiruvottri yur",
    "destination": "Kovalam",
    "routeStops": "Broadway, Marina Beach, Thiruvanmiyur, Injambakkam",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottri yur",
      "Broadway",
      "Marina Beach",
      "Thiruvanmiyur",
      "Injambakkam",
      "Kovalam"
    ]
  },
  {
    "busNo": "134A",
    "start": "Thiruvottiy ur",
    "destination": "Mogappair West",
    "routeStops": "",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Mogappair West"
    ]
  },
  {
    "busNo": "138A",
    "start": "Thiruvottiy ur",
    "destination": "Periyar Nagar",
    "routeStops": "Tondiarpet, Mint, Basin Bridge, Vyasarpadi, Moolakadai, TVK Nagar",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Tondiarpet",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "TVK Nagar",
      "Periyar Nagar"
    ]
  },
  {
    "busNo": "156",
    "start": "Thiruvotriy ur",
    "destination": "Karanodai",
    "routeStops": "",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvotriy ur",
      "Karanodai"
    ]
  },
  {
    "busNo": "159",
    "start": "Thiruvottiy ur",
    "destination": "Thiruverkadu",
    "routeStops": "Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Koyambedu, Nerkundram, Maduravoyal, Velappanchavadi",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Koyambedu",
      "Nerkundram",
      "Maduravoyal",
      "Velappanchavadi",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "159A",
    "start": "Thiruvotriy ur",
    "destination": "CMBT",
    "routeStops": "Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvotriy ur",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "CMBT"
    ]
  },
  {
    "busNo": "159C",
    "start": "Thiruvottiy ur",
    "destination": "Koyambedu Market",
    "routeStops": "Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "Koyambedu Market"
    ]
  },
  {
    "busNo": "556",
    "start": "Thiruvottiy ur",
    "destination": "Kattupalli",
    "routeStops": "Ernavoor Gate, Sathiyamoorthy Nagar, Andakuppam, Athipattu Pudhunagar, Ennore Thermal PowerStation, L&T Harbour, Kattupalli Village",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Ernavoor Gate",
      "Sathiyamoorthy Nagar",
      "Andakuppam",
      "Athipattu Pudhunagar",
      "Ennore Thermal PowerStation",
      "L&T Harbour",
      "Kattupalli Village",
      "Kattupalli"
    ]
  },
  {
    "busNo": "38D",
    "start": "Tiruvottiyur",
    "destination": "Parvathy Nagar (Kodungaiyur)",
    "routeStops": "",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Tiruvottiyur",
      "Parvathy Nagar (Kodungaiyur)"
    ]
  },
  {
    "busNo": "56T",
    "start": "Tiruvottiyur",
    "destination": "Madhavaram",
    "routeStops": "MFL",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Tiruvottiyur",
      "MFL",
      "Madhavaram"
    ]
  },
  {
    "busNo": "28",
    "start": "Thiruvotriy ur",
    "destination": "Chennai Egmore",
    "routeStops": "Tollgate,Tondiarpet,Vallalarnagar,Regal , Central RS, Chindatripet",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvotriy ur",
      "Tollgate",
      "Tondiarpet",
      "Vallalarnagar",
      "Regal",
      "Chennai Central",
      "Chindatripet",
      "Chennai Egmore"
    ]
  },
  {
    "busNo": "595A",
    "start": "Thiruvottiy ur",
    "destination": "Pazhaverkadu",
    "routeStops": "Sathyamoorthy nagar, Minjur, Kadapakkam, Thathanmanji, Perliyambakkam, Pulicut",
    "areaSection": "Thiruvottriyur",
    "stops": [
      "Thiruvottiy ur",
      "Sathyamoorthy nagar",
      "Minjur",
      "Kadapakkam",
      "Thathanmanji",
      "Perliyambakkam",
      "Pulicut",
      "Pazhaverkadu"
    ]
  },
  {
    "busNo": "T47",
    "start": "Tidel Park",
    "destination": "Villivakkam",
    "routeStops": "Madiakailash, Saidapet, T. Nagar, Anna Hospital, ICF",
    "areaSection": "Tidel Park",
    "stops": [
      "Tidel Park",
      "Madiakailash",
      "Saidapet",
      "T. Nagar",
      "Anna Hospital",
      "ICF",
      "Villivakkam"
    ]
  },
  {
    "busNo": "6A",
    "start": "Tollgate",
    "destination": "Besant Nagar",
    "routeStops": "Adyar, Foreshore Estate, Triplicane, Parry's Corner, Maharani, Washermanpet,",
    "areaSection": "Toll Gate",
    "stops": [
      "Tollgate",
      "Adyar",
      "Foreshore Estate",
      "Triplicane",
      "Parry's Corner",
      "Maharani",
      "Washermanpet",
      "Besant Nagar"
    ]
  },
  {
    "busNo": "8A",
    "start": "Tollgate",
    "destination": "Periyar Nagar",
    "routeStops": "Tondiarpet, V.Nagar, Regal, Choolai P.O, Otteri,Jamalaya, Venus",
    "areaSection": "Toll Gate",
    "stops": [
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O",
      "Otteri",
      "Jamalaya",
      "Venus",
      "Periyar Nagar"
    ]
  },
  {
    "busNo": "10A",
    "start": "Tollgate",
    "destination": "Saidapet West",
    "routeStops": "Kal mandapam, Parrys, Central R.S, Egmore R.S, Maternity Hospital, DPI, Sterling road, Valluvar Kottam, Panagal park, T.Nagar, Srinivasa Theater, Mettupalayam",
    "areaSection": "Toll Gate",
    "stops": [
      "Tollgate",
      "Kal mandapam",
      "Parrys",
      "Chennai Central",
      "Chennai Egmore",
      "Maternity Hospital",
      "DPI",
      "Sterling road",
      "Valluvar Kottam",
      "Panagal park",
      "T.Nagar",
      "Srinivasa Theater",
      "Mettupalayam",
      "Saidapet West"
    ]
  },
  {
    "busNo": "32A",
    "start": "Tollgate",
    "destination": "Foreshore Estate",
    "routeStops": "Maharani, Tondiarpet, Vallalar nagar, Broadway, Central R.S., Triplicane, V.House, AIR, Santhome",
    "areaSection": "Toll Gate",
    "stops": [
      "Tollgate",
      "Maharani",
      "Tondiarpet",
      "Vallalar nagar",
      "Broadway",
      "Chennai Central.",
      "Triplicane",
      "V.House",
      "AIR",
      "Santhome",
      "Foreshore Estate"
    ]
  },
  {
    "busNo": "159B",
    "start": "Tollgate",
    "destination": "CMBT",
    "routeStops": "Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "Toll Gate",
    "stops": [
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "CMBT"
    ]
  },
  {
    "busNo": "6D",
    "start": "Tollgate",
    "destination": "Thiruvanmiyur",
    "routeStops": "Besant Nagar, Foreshore Estate, Parry's Corner",
    "areaSection": "Toll Gate",
    "stops": [
      "Tollgate",
      "Besant Nagar",
      "Foreshore Estate",
      "Parry's Corner",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "595",
    "start": "Tollgate",
    "destination": "Pazhaverkadu",
    "routeStops": "Thiruvottriyur, Sathyamoorthy nagar, Minjur, Kadapakkam, Thathanmanji, Perliyambakkam, Pulicut",
    "areaSection": "Toll Gate",
    "stops": [
      "Tollgate",
      "Thiruvottriyur",
      "Sathyamoorthy nagar",
      "Minjur",
      "Kadapakkam",
      "Thathanmanji",
      "Perliyambakkam",
      "Pulicut",
      "Pazhaverkadu"
    ]
  },
  {
    "busNo": "24A",
    "start": "V House",
    "destination": "Anna Nagar West",
    "routeStops": "Shanthi Colony, K4 Police station, Chinthamani, Aminijikarai, Chetpet, Gemini, Royapetah",
    "areaSection": "Vivekanandar House",
    "stops": [
      "V House",
      "Shanthi Colony",
      "K4 Police station",
      "Chinthamani",
      "Aminijikarai",
      "Chetpet",
      "Gemini",
      "Royapetah",
      "Anna Nagar West"
    ]
  },
  {
    "busNo": "24C",
    "start": "V House",
    "destination": "Avadi",
    "routeStops": "Ambattur OT, Collector Nagar, Blue Star, Chinthamani, Aminijikarai, Chetpet, Gemini, Royapetah",
    "areaSection": "Vivekanandar House",
    "stops": [
      "V House",
      "Ambattur OT",
      "Collector Nagar",
      "Blue Star",
      "Chinthamani",
      "Aminijikarai",
      "Chetpet",
      "Gemini",
      "Royapetah",
      "Avadi"
    ]
  },
  {
    "busNo": "32",
    "start": "V. House",
    "destination": "Vallalar Nagar",
    "routeStops": "Broadway, Central R.S., Simpson",
    "areaSection": "Vivekanandar House",
    "stops": [
      "V. House",
      "Broadway",
      "Chennai Central.",
      "Simpson",
      "Vallalar Nagar"
    ]
  },
  {
    "busNo": "32B",
    "start": "V. House",
    "destination": "Korukkupet",
    "routeStops": "Vallalar nagar, Broadway, Central R.S., Simpson",
    "areaSection": "Vivekanandar House",
    "stops": [
      "V. House",
      "Vallalar nagar",
      "Broadway",
      "Chennai Central.",
      "Simpson",
      "Korukkupet"
    ]
  },
  {
    "busNo": "12",
    "start": "Vivekananda House",
    "destination": "T.Nagar",
    "routeStops": "Teynampet, Alwarpet, Luz, Chennai Citi Centre",
    "areaSection": "Vivekanandar House",
    "stops": [
      "Vivekananda House",
      "Teynampet",
      "Alwarpet",
      "Luz",
      "Chennai Citi Centre",
      "T.Nagar"
    ]
  },
  {
    "busNo": "29D",
    "start": "V House",
    "destination": "Mathur MMDA",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, Perambur, Otteri, Devoton, Egmore, Pudhupet, Walaja Road",
    "areaSection": "Vivekanandar House",
    "stops": [
      "V House",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "Perambur",
      "Otteri",
      "Devoton",
      "Egmore",
      "Pudhupet",
      "Walaja Road",
      "Mathur MMDA"
    ]
  },
  {
    "busNo": "38C",
    "start": "V House",
    "destination": "TVK Nagar",
    "routeStops": "Venus, Perambur, Pattalam, Bhuvaneswari, Doveton, Choolai P.O, Central R.S, Simpson, Adam market, Triplicane P.O",
    "areaSection": "Vivekanandar House",
    "stops": [
      "V House",
      "Venus",
      "Perambur",
      "Pattalam",
      "Bhuvaneswari",
      "Doveton",
      "Choolai P.O",
      "Chennai Central",
      "Simpson",
      "Adam market",
      "Triplicane P.O",
      "TVK Nagar"
    ]
  },
  {
    "busNo": "45A",
    "start": "V.House",
    "destination": "Velachery",
    "routeStops": "Saidapet, Nandanam, Adyar Gate",
    "areaSection": "Vivekanandar House",
    "stops": [
      "V.House",
      "Saidapet",
      "Nandanam",
      "Adyar Gate",
      "Velachery"
    ]
  },
  {
    "busNo": "37D",
    "start": "V Nagar",
    "destination": "KK Nagar",
    "routeStops": "Regal, Choolai P.O., Purasaivakkam,KMC, Chetpet,Ste rling road, Valluvarkottam, Liberty, Samiarmadam, Udhayam, Nesapakkam, MGR Nagar",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasaivakkam",
      "KMC",
      "Chetpet",
      "Ste rling road",
      "Valluvarkottam",
      "Liberty",
      "Samiarmadam",
      "Udhayam",
      "Nesapakkam",
      "MGR Nagar",
      "KK Nagar"
    ]
  },
  {
    "busNo": "56A",
    "start": "V Nagar",
    "destination": "Ennore",
    "routeStops": "",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Ennore"
    ]
  },
  {
    "busNo": "56W",
    "start": "V Nagar",
    "destination": "Madhavaram",
    "routeStops": "Tondiarpet, Thiruvottriyur, MFL",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Tondiarpet",
      "Thiruvottriyur",
      "MFL",
      "Madhavaram"
    ]
  },
  {
    "busNo": "57",
    "start": "V Nagar",
    "destination": "Red Hills",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills"
    ]
  },
  {
    "busNo": "59",
    "start": "V Nagar",
    "destination": "Thiruverkadu",
    "routeStops": "Basinbridge, Elephantgate, Doveton, Purasawakam, KMC, Aminjikarai, Arumbakkam, Maduravoyal, Velappanchavadi",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basinbridge",
      "Elephantgate",
      "Doveton",
      "Purasawakam",
      "KMC",
      "Aminjikarai",
      "Arumbakkam",
      "Maduravoyal",
      "Velappanchavadi",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "248",
    "start": "V Nagar",
    "destination": "Pudur",
    "routeStops": "Ambattur, Ambattur IE, Padi, Nadhamuni, ICF, Joint Office, Otteri, Pattalam, Pulianthopu Police station, Basin Bridge",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Ambattur",
      "Ambattur IE",
      "Padi",
      "Nadhamuni",
      "ICF",
      "Joint Office",
      "Otteri",
      "Pattalam",
      "Pulianthopu Police station",
      "Basin Bridge",
      "Pudur"
    ]
  },
  {
    "busNo": "248xt",
    "start": "V Nagar",
    "destination": "Oragadam",
    "routeStops": "Ambattur, Ambattur IE, Padi, Lucas TVS, ICF, Joint Office, Otteri, Basin Bridge",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Ambattur",
      "Ambattur IE",
      "Padi",
      "Lucas TVS",
      "ICF",
      "Joint Office",
      "Otteri",
      "Basin Bridge",
      "Oragadam"
    ]
  },
  {
    "busNo": "248A",
    "start": "V Nagar",
    "destination": "Kallikuppam",
    "routeStops": "Pudur",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Pudur",
      "Kallikuppam"
    ]
  },
  {
    "busNo": "248P",
    "start": "V Nagar",
    "destination": "Puthagaram",
    "routeStops": "Pudur",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Pudur",
      "Puthagaram"
    ]
  },
  {
    "busNo": "547",
    "start": "V Nagar",
    "destination": "Periyapalayam",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Siruvapuri",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Siruvapuri",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "547A",
    "start": "V Nagar",
    "destination": "Periyapalayam",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Akarambakkam, Arani, Kosavampettai",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Akarambakkam",
      "Arani",
      "Kosavampettai",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "557A",
    "start": "V Nagar",
    "destination": "Rettambedu",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Thachur Koot Road, Puduvayal, Kavarapettai",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Thachur Koot Road",
      "Puduvayal",
      "Kavarapettai",
      "Rettambedu"
    ]
  },
  {
    "busNo": "558P",
    "start": "V.Nagar",
    "destination": "Perumbedukup pam",
    "routeStops": "Vysarpadi, Moolakadai, Madhavaram, Redhills, Karanodai, Ponneri, Chinnakuvanam, Perumbedu",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V.Nagar",
      "Vysarpadi",
      "Moolakadai",
      "Madhavaram",
      "Redhills",
      "Karanodai",
      "Ponneri",
      "Chinnakuvanam",
      "Perumbedu",
      "Perumbedukup pam"
    ]
  },
  {
    "busNo": "592",
    "start": "V Nagar",
    "destination": "Periyapalayam",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai,Janappan Chathram x road, Bandikavanoor,Kannigaipair",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Janappan Chathramx road",
      "Bandikavanoor",
      "Kannigaipair",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "592G",
    "start": "V Nagar",
    "destination": "Periyapalayam",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai,Pandy Kavanoor Rd JN, Kannigaipair",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Pandy Kavanoor Rd JN",
      "Kannigaipair",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "592V",
    "start": "V Nagar",
    "destination": "Vengal",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Poorivakkam",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Poorivakkam",
      "Vengal"
    ]
  },
  {
    "busNo": "11A",
    "start": "Vallalar Nagar",
    "destination": "T.Nagar",
    "routeStops": "Annasalai, Central R.S, Parry's Corner, Stanley Hospital",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "Vallalar Nagar",
      "Annasalai",
      "Chennai Central",
      "Parry's Corner",
      "Stanley Hospital",
      "T.Nagar"
    ]
  },
  {
    "busNo": "M11A",
    "start": "Vallalar Nagar",
    "destination": "Rengarajapuram",
    "routeStops": "Pangal Park, Annasalai, Central R.S, Parry's Corner",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "Vallalar Nagar",
      "Pangal Park",
      "Annasalai",
      "Chennai Central",
      "Parry's Corner",
      "Rengarajapuram"
    ]
  },
  {
    "busNo": "532",
    "start": "Vallalar Nagar",
    "destination": "Periyapalayam",
    "routeStops": "Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red Hills, Karanodai, Arani",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "Vallalar Nagar",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red Hills",
      "Karanodai",
      "Arani",
      "Periyapalayam"
    ]
  },
  {
    "busNo": "32",
    "start": "Vallalar Nagar",
    "destination": "V. House",
    "routeStops": "Broadway, Central R.S., Simpson",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "Vallalar Nagar",
      "Broadway",
      "Chennai Central.",
      "Simpson",
      "V. House"
    ]
  },
  {
    "busNo": "37G",
    "start": "V Nagar",
    "destination": "Iyyapanthangal",
    "routeStops": "Regal, Choolai P.O., Purasaivakkam,KMC, Chetpet,Ste rling road, Valluvarkottam, Liberty, Vadapalani, Porur, SRMC",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "V Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasaivakkam",
      "KMC",
      "Chetpet",
      "Ste rling road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani",
      "Porur",
      "SRMC",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "48",
    "start": "Vallalar Nagar",
    "destination": "Villivakkam",
    "routeStops": "ICF, Railway Quarters, Joint Office, Sayani, Otterri, Basin Bridge",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "Vallalar Nagar",
      "ICF",
      "Railway Quarters",
      "Joint Office",
      "Sayani",
      "Otterri",
      "Basin Bridge",
      "Villivakkam"
    ]
  },
  {
    "busNo": "48C",
    "start": "Vallalar Nagar",
    "destination": "CMBT",
    "routeStops": "Thirumangalam, Anna Nagar West, Nadhamuni, ICF, Railway Quarters, Joint Office, Sayani, Otterri, Basin Bridge",
    "areaSection": "Vallalar Nagar",
    "stops": [
      "Vallalar Nagar",
      "Thirumangalam",
      "Anna Nagar West",
      "Nadhamuni",
      "ICF",
      "Railway Quarters",
      "Joint Office",
      "Sayani",
      "Otterri",
      "Basin Bridge",
      "CMBT"
    ]
  },
  {
    "busNo": "54S",
    "start": "Vadaku Malaiyamb akkam",
    "destination": "T.Nagar",
    "routeStops": "Poonamallee, Kumanan chavadi, Iyyppanthangal, Porur, Guindy, Saidapet",
    "areaSection": "Vadakku Malaiyapakam",
    "stops": [
      "Vadaku Malaiyamb akkam",
      "Poonamallee",
      "Kumanan chavadi",
      "Iyyppanthangal",
      "Porur",
      "Guindy",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "5E",
    "start": "Vadapalani",
    "destination": "Besant Nagar",
    "routeStops": "Nesapakkam, MGR Nagar, KK Nagar, Ashok pillar, Jafferkhanpet, Mettupalayam, Srinivasa theater, CIT nagar, Saidapet, Anna University, Adyar, Vannanthurai, Velankkani church",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Nesapakkam",
      "MGR Nagar",
      "KK Nagar",
      "Ashok pillar",
      "Jafferkhanpet",
      "Mettupalayam",
      "Srinivasa theater",
      "CIT nagar",
      "Saidapet",
      "Anna University",
      "Adyar",
      "Vannanthurai",
      "Velankkani church",
      "Besant Nagar"
    ]
  },
  {
    "busNo": "5T",
    "start": "Vadapalani",
    "destination": "Taramani",
    "routeStops": "Saidapet, T.Nagar, Ashok pillar, K.K.Nagar",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Saidapet",
      "T.Nagar",
      "Ashok pillar",
      "K.K.Nagar",
      "Taramani"
    ]
  },
  {
    "busNo": "17P",
    "start": "Vadapalani",
    "destination": "Pattur",
    "routeStops": "Mangadu, Porur, Virugambakkam",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Mangadu",
      "Porur",
      "Virugambakkam",
      "Pattur"
    ]
  },
  {
    "busNo": "G70",
    "start": "Vadapalani",
    "destination": "Guduvanchery",
    "routeStops": "Udhayam Theater, Pallavaram, Tambaram, Vandalur Zoo",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Udhayam Theater",
      "Pallavaram",
      "Tambaram",
      "Vandalur Zoo",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "501",
    "start": "Vadapalani",
    "destination": "Poondi",
    "routeStops": "Virugamabakkam, Valasarawakkam,Porur, Iyyapanthangal, Kumananchavadi, Poonamallee, Thirumazhisai, Nemam, Manavalan Nagar, Thiruvallur",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Virugamabakkam",
      "Valasarawakkam",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Nemam",
      "Manavalan Nagar",
      "Thiruvallur",
      "Poondi"
    ]
  },
  {
    "busNo": "538",
    "start": "Vadapalani",
    "destination": "Kadambathur",
    "routeStops": "Virugamabakkam, Valasarawakkam,Porur, Iyyapanthangal, Kumananchavadi, Poonamallee, Thirumazhisai, Nemam, Manavalan Nagar, Thiruvallur, Thirupatchur",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Virugamabakkam",
      "Valasarawakkam",
      "Porur",
      "Iyyapanthangal",
      "Kumananchavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Nemam",
      "Manavalan Nagar",
      "Thiruvallur",
      "Thirupatchur",
      "Kadambathur"
    ]
  },
  {
    "busNo": "12B",
    "start": "Vadapalani",
    "destination": "Foreshore Estate",
    "routeStops": "Kodambakkam, Pondy Bazaar, Alwarpet, Luz, Santhome",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Kodambakkam",
      "Pondy Bazaar",
      "Alwarpet",
      "Luz",
      "Santhome",
      "Foreshore Estate"
    ]
  },
  {
    "busNo": "15F",
    "start": "Vadapalani",
    "destination": "Broadway",
    "routeStops": "Virugambakkam, Chinmaya nagar, Koyambedu Market, CMBT, Amijikarai, KMC, Dasaprakash, Central R.S",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Virugambakkam",
      "Chinmaya nagar",
      "Koyambedu Market",
      "CMBT",
      "Amijikarai",
      "KMC",
      "Dasaprakash",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "17",
    "start": "Vadapalani",
    "destination": "Broadway",
    "routeStops": "Central,Chindatripet,Egmore RS, Chetpet,Sterling road, Loyola college, Kodambakkam",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Central",
      "Chindatripet",
      "Chennai Egmore",
      "Chetpet",
      "Sterling road",
      "Loyola college",
      "Kodambakkam",
      "Broadway"
    ]
  },
  {
    "busNo": "37",
    "start": "Vadapalani",
    "destination": "V Nagar",
    "routeStops": "Regal, Choolai P.O., Purasaivakkam,KMC, Chetpet,Ste rling road, Valluvarkottam, Liberty",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Regal",
      "Choolai P.O.",
      "Purasaivakkam",
      "KMC",
      "Chetpet",
      "Ste rling road",
      "Valluvarkottam",
      "Liberty",
      "V Nagar"
    ]
  },
  {
    "busNo": "37C",
    "start": "Vadapalani",
    "destination": "Villivakkam",
    "routeStops": "Kambar Arangam,Ayanavara,Kellys,Purasaiwak kam, Egmore,DPI, Sterling Road, Valluvarkottam, Liberty",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Kambar Arangam",
      "Ayanavara",
      "Kellys",
      "Purasaiwak kam",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Villivakkam"
    ]
  },
  {
    "busNo": "37E",
    "start": "Vadapalani",
    "destination": "M.K.B Nagar",
    "routeStops": "Vysarpadi, V Nagar,Regal,Choolai P.O.,Purasaiwakkam, Egmore,DPI, Sterling Road, Valluvarkottam, Liberty",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Vysarpadi",
      "V Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasaiwakkam",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "M.K.B Nagar"
    ]
  },
  {
    "busNo": "M88",
    "start": "Vadapalani",
    "destination": "Kundrathur",
    "routeStops": "Porur",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Porur",
      "Kundrathur"
    ]
  },
  {
    "busNo": "578A",
    "start": "Vadapalani",
    "destination": "Sriperumbudur",
    "routeStops": "Virugambakkam, Valasarawakkam, Porur, Kovoor, Kundrathur, Somangalam, Nallur, Sumtheramedu Koot road, Pillaipakkam, Pattunool",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Virugambakkam",
      "Valasarawakkam",
      "Porur",
      "Kovoor",
      "Kundrathur",
      "Somangalam",
      "Nallur",
      "Sumtheramedu Koot road",
      "Pillaipakkam",
      "Pattunool",
      "Sriperumbudur"
    ]
  },
  {
    "busNo": "591B",
    "start": "Vadapalani",
    "destination": "Perambakkam",
    "routeStops": "Virugambakkam, Porur, Poonamallee, Thandalam, Mannur, Kattukoot rd, Mappedu",
    "areaSection": "Vadapalani",
    "stops": [
      "Vadapalani",
      "Virugambakkam",
      "Porur",
      "Poonamallee",
      "Thandalam",
      "Mannur",
      "Kattukoot rd",
      "Mappedu",
      "Perambakkam"
    ]
  },
  {
    "busNo": "A18",
    "start": "Vandalur Zoo",
    "destination": "High Court",
    "routeStops": "LIC, TVS, Saidapet, Guindy, Pallavaram, Chromepet, Tambaram",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "High Court"
    ]
  },
  {
    "busNo": "B18",
    "start": "Vandalur Zoo",
    "destination": "Korukkupet",
    "routeStops": "Broadway, LIC, TVS, Saidapet, Guindy, Pallavaram, Tambaram",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "Broadway",
      "LIC",
      "TVS",
      "Saidapet",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Korukkupet"
    ]
  },
  {
    "busNo": "170T",
    "start": "Vandalur Zoo",
    "destination": "Kaviarasu Kannadasan Nagar",
    "routeStops": "MR Nagar, Moolakadai, Retteri, Thirumangalam, CMBT, Vadapalani, Guindy, Pallavaram, Tambaram",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "MR Nagar",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Kaviarasu Kannadasan Nagar"
    ]
  },
  {
    "busNo": "515V",
    "start": "Vandalur",
    "destination": "Kelambakkam",
    "routeStops": "Mambakkam",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur",
      "Mambakkam",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "A21",
    "start": "Vandalur Zoo",
    "destination": "Thiruvanmiyur",
    "routeStops": "SRP Tools,Thorapakkam,Redial Road,Kamatchi Hospital, Eechangadu,Pallavaram, Chromepet, Tambaram, Perugalathur",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "SRP Tools",
      "Thorapakkam",
      "Redial Road",
      "Kamatchi Hospital",
      "Eechangadu",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Perugalathur",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "PP66",
    "start": "Vandalur Zoo",
    "destination": "Poonamallee",
    "routeStops": "Tambaram, Chromepet, Pallavaram, Pammal, Anakaputhur, Kundrathur, Mangadu, Karaiyanchavadi",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "Tambaram",
      "Chromepet",
      "Pallavaram",
      "Pammal",
      "Anakaputhur",
      "Kundrathur",
      "Mangadu",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "70A",
    "start": "Vandalur Zoo",
    "destination": "Avadi",
    "routeStops": "Tambaram",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "Tambaram",
      "Avadi"
    ]
  },
  {
    "busNo": "114",
    "start": "Vandalur Zoo",
    "destination": "Red Hills",
    "routeStops": "Tambaram, Pallavaram, Guindy, Ashok nagar, Vadapalani, CMBT, Thirumangalam, Anna nagar west, Padi, Thathankuppam, Kolathur,",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Ashok nagar",
      "Vadapalani",
      "CMBT",
      "Thirumangalam",
      "Anna nagar west",
      "Padi",
      "Thathankuppam",
      "Kolathur",
      "Red Hills"
    ]
  },
  {
    "busNo": "170A",
    "start": "Vandalur Zoo",
    "destination": "Madhavaram",
    "routeStops": "Thapal petti, Moolakadai, Retteri, Thirumangalam, CMBT, Vadapalani, Guindy, Pallavaram, Tambaram",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Tambaram",
      "Madhavaram"
    ]
  },
  {
    "busNo": "170L",
    "start": "Vandalur Zoo",
    "destination": "Kallikuppam",
    "routeStops": "Tambaram, Pallavaram, Guindy, Vadapalani, CMBT, Anna Nagar, Padi, Ambattur I.E, Ambattur OT, Pudur",
    "areaSection": "Vandalur",
    "stops": [
      "Vandalur Zoo",
      "Tambaram",
      "Pallavaram",
      "Guindy",
      "Vadapalani",
      "CMBT",
      "Anna Nagar",
      "Padi",
      "Ambattur I.E",
      "Ambattur OT",
      "Pudur",
      "Kallikuppam"
    ]
  },
  {
    "busNo": "M14A",
    "start": "Velachery",
    "destination": "Medavakkam Koot Road",
    "routeStops": "Vanuvampettai, Madipakkam, Kilkattalai",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Vanuvampettai",
      "Madipakkam",
      "Kilkattalai",
      "Medavakkam Koot Road"
    ]
  },
  {
    "busNo": "19V",
    "start": "Velachery",
    "destination": "Kovalam",
    "routeStops": "Taramani, SRP Tools, Jayanthi, Thiruvanmiyur, Injambakkam, MGM, Muttukadu",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Taramani",
      "SRP Tools",
      "Jayanthi",
      "Thiruvanmiyur",
      "Injambakkam",
      "MGM",
      "Muttukadu",
      "Kovalam"
    ]
  },
  {
    "busNo": "21J",
    "start": "Velachery",
    "destination": "Guduvanchery",
    "routeStops": "Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road, Poondi Bazar, Tambaram Sanatorium, Tambaram West, Vandalur",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Poondi Bazar",
      "Tambaram Sanatorium",
      "Tambaram West",
      "Vandalur",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "21J cut",
    "start": "Velachery",
    "destination": "Tambaram West",
    "routeStops": "Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road, Poondi Bazar, Tambaram Sanatorium",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Poondi Bazar",
      "Tambaram Sanatorium",
      "Tambaram West"
    ]
  },
  {
    "busNo": "21P",
    "start": "Velachery",
    "destination": "Tambaram",
    "routeStops": "Madipakkam, Kilkattalai, Eachangadu, Chromepet",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Madipakkam",
      "Kilkattalai",
      "Eachangadu",
      "Chromepet",
      "Tambaram"
    ]
  },
  {
    "busNo": "M21",
    "start": "Velachery",
    "destination": "Tambaram West",
    "routeStops": "Narayanapuram, Pallikaranai, Medavakkam, Camp Road, Tambaram East",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Camp Road",
      "Tambaram East",
      "Tambaram West"
    ]
  },
  {
    "busNo": "M21 cut",
    "start": "Velachery",
    "destination": "Medavakkam Koot Road",
    "routeStops": "Narayanapuram, Pallikaranai, Medavakkam",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Medavakkam Koot Road"
    ]
  },
  {
    "busNo": "M21B",
    "start": "Velachery",
    "destination": "Chromepet",
    "routeStops": "Narayanapuram, Pallikaranai, Medavakkam, Santhosapuram, Sembakkam, Thirumalai Nagar, Hasthinapuram",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Santhosapuram",
      "Sembakkam",
      "Thirumalai Nagar",
      "Hasthinapuram",
      "Chromepet"
    ]
  },
  {
    "busNo": "23V",
    "start": "Velachery",
    "destination": "Villivakkam",
    "routeStops": "ICF, Ayanavaram, Purasaiwakkam, Egmore, LIC, TVS, Saidapet, Check post",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "ICF",
      "Ayanavaram",
      "Purasaiwakkam",
      "Egmore",
      "LIC",
      "TVS",
      "Saidapet",
      "Check post",
      "Villivakkam"
    ]
  },
  {
    "busNo": "29N",
    "start": "Velachery",
    "destination": "Perambur",
    "routeStops": "Saidapet, T. Nagar, DMS, Gemini, Sterling Road/College Road, KMC",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Saidapet",
      "T. Nagar",
      "DMS",
      "Gemini",
      "Sterling Road/College Road",
      "KMC",
      "Perambur"
    ]
  },
  {
    "busNo": "B29N",
    "start": "Velachery",
    "destination": "Periyar nagar",
    "routeStops": "Saidapet, T. Nagar, DMS, Gemini, Sterling Road/College Road, KMC, Doveton, Perambur, Venus",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Saidapet",
      "T. Nagar",
      "DMS",
      "Gemini",
      "Sterling Road/College Road",
      "KMC",
      "Doveton",
      "Perambur",
      "Venus",
      "Periyar nagar"
    ]
  },
  {
    "busNo": "45A",
    "start": "Velachery",
    "destination": "V.House",
    "routeStops": "Saidapet, Nandanam, Adyar Gate",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Saidapet",
      "Nandanam",
      "Adyar Gate",
      "V.House"
    ]
  },
  {
    "busNo": "M45A",
    "start": "Velachery",
    "destination": "Anna Square",
    "routeStops": "Saidapet, Nandanam, Adyar Gate",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Saidapet",
      "Nandanam",
      "Adyar Gate",
      "Anna Square"
    ]
  },
  {
    "busNo": "170M",
    "start": "Velachery",
    "destination": "Manali",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, TVK Nagar, Retteri, Thirumangalam, CMBT, Vadapalani, Ashok pillar, Guindy, Checkpost",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "TVK Nagar",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok pillar",
      "Guindy",
      "Checkpost",
      "Manali"
    ]
  },
  {
    "busNo": "551",
    "start": "Velachery",
    "destination": "T. Acharavakkam",
    "routeStops": "Medavakkam,Sithalapakkam Koot road, Kovilancherry, Madurapakkam, Ponmar, Mambakkam, Kayar, Vembedu, Chembakkam Village",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Medavakkam",
      "Sithalapakkam Koot road",
      "Kovilancherry",
      "Madurapakkam",
      "Ponmar",
      "Mambakkam",
      "Kayar",
      "Vembedu",
      "Chembakkam Village",
      "T. Acharavakkam"
    ]
  },
  {
    "busNo": "552",
    "start": "Velachery",
    "destination": "Maraimalai Nagar",
    "routeStops": "Guindy",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Guindy",
      "Maraimalai Nagar"
    ]
  },
  {
    "busNo": "1G",
    "start": "Velachery",
    "destination": "Thiruvottiyur",
    "routeStops": "Saidapet, Annasalai, Parry's Corner, Kalmandapam, Tollgate",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Saidapet",
      "Annasalai",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "5R",
    "start": "Velachery",
    "destination": "Saidapet",
    "routeStops": "Guindy, N.G.O. Colony, St.Thomas Mount, Vanuvampet, Velachery MRTS",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Guindy",
      "N.G.O. Colony",
      "St.Thomas Mount",
      "Vanuvampet",
      "Velachery MRTS",
      "Saidapet"
    ]
  },
  {
    "busNo": "21L",
    "start": "Velachery",
    "destination": "Broadway",
    "routeStops": "Marina Beach, Foreshore Estate, MRC Nagar, Adyar, Anna University, Rajbhavan, Checkpost, Dhandeswarnagar",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Marina Beach",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "Anna University",
      "Rajbhavan",
      "Checkpost",
      "Dhandeswarnagar",
      "Broadway"
    ]
  },
  {
    "busNo": "L21",
    "start": "Velachery",
    "destination": "Broadway",
    "routeStops": "Marina Beach, Foreshore Estate, MRC Nagar, Adyar, SRP Tools",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Marina Beach",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Broadway"
    ]
  },
  {
    "busNo": "V51 cut",
    "start": "Velachery",
    "destination": "Tambaram West",
    "routeStops": "Ram Nagar, Madipakkam, Kilkattalai, Kovilambakkam, Medavakkam Koot Road, Kamarajapuram, Camp Road",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Ram Nagar",
      "Madipakkam",
      "Kilkattalai",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Kamarajapuram",
      "Camp Road",
      "Tambaram West"
    ]
  },
  {
    "busNo": "70W",
    "start": "Velachery",
    "destination": "Mugappair West",
    "routeStops": "Wavin, Collector Nagar, CMBT, Vadapalani, Ashok Pillar, Guindy",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Wavin",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy",
      "Mugappair West"
    ]
  },
  {
    "busNo": "D70",
    "start": "Velachery",
    "destination": "Ambattur I.E",
    "routeStops": "Collector Nagar, CMBT, Vadapalani, Ashok nagar, Guindy, Checkpost, Velachery Bypass road",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Checkpost",
      "Velachery Bypass road",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "D70 xt",
    "start": "Velachery",
    "destination": "Pattabiram",
    "routeStops": "Avadi, Ambattur O.T, Ambattur I.E",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Avadi",
      "Ambattur O.T",
      "Ambattur I.E",
      "Pattabiram"
    ]
  },
  {
    "busNo": "M170",
    "start": "Velachery",
    "destination": "Thiruverkadu",
    "routeStops": "Velappan chavadi, Vanagaram, Maduravoyal, Nerkundram, Koyambedu Market, CMBT, Vadapalani, Ashok Pillar, Guindy, Checkpost",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Velappan chavadi",
      "Vanagaram",
      "Maduravoyal",
      "Nerkundram",
      "Koyambedu Market",
      "CMBT",
      "Vadapalani",
      "Ashok Pillar",
      "Guindy",
      "Checkpost",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "500J",
    "start": "Velachery",
    "destination": "Chengalpattu",
    "routeStops": "Pallikkaranai, Medavakkam, Kamarajapuram, Camp Road, Tambaram East, Tambaram West, Vandalur Zoo",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Pallikkaranai",
      "Medavakkam",
      "Kamarajapuram",
      "Camp Road",
      "Tambaram East",
      "Tambaram West",
      "Vandalur Zoo",
      "Chengalpattu"
    ]
  },
  {
    "busNo": "500V",
    "start": "Velachery",
    "destination": "Chengalpattu",
    "routeStops": "Guindy, Pallvaram, Tambaram West, Vandalur Zoo",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Guindy",
      "Pallvaram",
      "Tambaram West",
      "Vandalur Zoo",
      "Chengalpattu"
    ]
  },
  {
    "busNo": "568B",
    "start": "Velachery",
    "destination": "Thirupporur",
    "routeStops": "Sholinganallur, Kelambakkam",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "579V",
    "start": "Velachery",
    "destination": "Padappai",
    "routeStops": "Mudichur, Tambaram, Chromepet, Eachangadu, Kilkattalai, Madipakkam, Ram Nagar",
    "areaSection": "Velacherry",
    "stops": [
      "Velachery",
      "Mudichur",
      "Tambaram",
      "Chromepet",
      "Eachangadu",
      "Kilkattalai",
      "Madipakkam",
      "Ram Nagar",
      "Padappai"
    ]
  },
  {
    "busNo": "154E",
    "start": "Vellavedu",
    "destination": "Ekkaduthangal",
    "routeStops": "Poonamallee, Kumananchavadi, Porur, Guindy",
    "areaSection": "Vellavedu",
    "stops": [
      "Vellavedu",
      "Poonamallee",
      "Kumananchavadi",
      "Porur",
      "Guindy",
      "Ekkaduthangal"
    ]
  },
  {
    "busNo": "54L",
    "start": "Vellavedu",
    "destination": "High Court",
    "routeStops": "Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet, DMS, TVS, LIC, Central R.S",
    "areaSection": "Vellavedu",
    "stops": [
      "Vellavedu",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "G54",
    "start": "Vellavedu",
    "destination": "T.Nagar",
    "routeStops": "Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet",
    "areaSection": "Vellavedu",
    "stops": [
      "Vellavedu",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "253",
    "start": "Vellavedu",
    "destination": "Aminjikarai",
    "routeStops": "NSK, Mathuravoyal, Vellapanchavadi, Kumananchavadi, Poonamallee, Thirumazhisai",
    "areaSection": "Vellavedu",
    "stops": [
      "Vellavedu",
      "NSK",
      "Mathuravoyal",
      "Vellapanchavadi",
      "Kumananchavadi",
      "Poonamallee",
      "Thirumazhisai",
      "Aminjikarai"
    ]
  },
  {
    "busNo": "70P",
    "start": "Veppampat tu",
    "destination": "T. Nagar",
    "routeStops": "Thirunindravur, Avadi, Ambattur OT, Collector Nagar, CMBT, Liberty",
    "areaSection": "Veppampattu",
    "stops": [
      "Veppampat tu",
      "Thirunindravur",
      "Avadi",
      "Ambattur OT",
      "Collector Nagar",
      "CMBT",
      "Liberty",
      "T. Nagar"
    ]
  },
  {
    "busNo": "40A xt",
    "start": "Veppampat tu",
    "destination": "Egmore",
    "routeStops": "KMC, Aminijikarai, Chinthamani, Blue Star, Collector Nagar, Ambattur OT, Avadi, Pattabiram, Thirunindravur",
    "areaSection": "Veppampattu",
    "stops": [
      "Veppampat tu",
      "KMC",
      "Aminijikarai",
      "Chinthamani",
      "Blue Star",
      "Collector Nagar",
      "Ambattur OT",
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "Egmore"
    ]
  },
  {
    "busNo": "54V",
    "start": "Veppampat tu",
    "destination": "T.Nagar",
    "routeStops": "Sri ram Engg college,Perumalpattu, Ramasamy nagar, Periyakottambedu, Pudhuchatiram, Vellavedu,Poonamallee, Kumananchavadi, SRMC, Porur, Guindy, Saidapet",
    "areaSection": "Veppampattu",
    "stops": [
      "Veppampat tu",
      "Sri ram Engg college",
      "Perumalpattu",
      "Ramasamy nagar",
      "Periyakottambedu",
      "Pudhuchatiram",
      "Vellavedu",
      "Poonamallee",
      "Kumananchavadi",
      "SRMC",
      "Porur",
      "Guindy",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "70E",
    "start": "Veppampat tu",
    "destination": "CMBT",
    "routeStops": "Collector Nagar, Ambattur OT, Avadi, Pattabiram, Thirunindravur",
    "areaSection": "Veppampattu",
    "stops": [
      "Veppampat tu",
      "Collector Nagar",
      "Ambattur OT",
      "Avadi",
      "Pattabiram",
      "Thirunindravur",
      "CMBT"
    ]
  },
  {
    "busNo": "20T",
    "start": "Villivakkam",
    "destination": "Thiruverkadu",
    "routeStops": "Ambattur I.E, Ayapakkam",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Ambattur I.E",
      "Ayapakkam",
      "Thiruverkadu"
    ]
  },
  {
    "busNo": "37C",
    "start": "Villivakkam",
    "destination": "Vadapalani",
    "routeStops": "Kambar Arangam,Ayanavara,Kellys,Purasaiwak kam, Egmore,DPI, Sterling Road, Valluvarkottam, Liberty",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Kambar Arangam",
      "Ayanavara",
      "Kellys",
      "Purasaiwak kam",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Vadapalani"
    ]
  },
  {
    "busNo": "48",
    "start": "Villivakkam",
    "destination": "Vallalar Nagar",
    "routeStops": "ICF, Railway Quarters, Joint Office, Sayani, Otterri, Basin Bridge",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "ICF",
      "Railway Quarters",
      "Joint Office",
      "Sayani",
      "Otterri",
      "Basin Bridge",
      "Vallalar Nagar"
    ]
  },
  {
    "busNo": "70T",
    "start": "Villivakkam",
    "destination": "Tambaram",
    "routeStops": "Nadhamuni, Thirumangalam, CMBT, Vadapalani, Guindy, Pallavaram",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Nadhamuni",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Tambaram"
    ]
  },
  {
    "busNo": "20",
    "start": "Villivakkam",
    "destination": "Broadway",
    "routeStops": "",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Broadway"
    ]
  },
  {
    "busNo": "23V",
    "start": "Villivakkam",
    "destination": "Velachery",
    "routeStops": "ICF, Ayanavaram, Purasaiwakkam, Egmore, LIC, TVS, Saidapet, Check post",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "ICF",
      "Ayanavaram",
      "Purasaiwakkam",
      "Egmore",
      "LIC",
      "TVS",
      "Saidapet",
      "Check post",
      "Velachery"
    ]
  },
  {
    "busNo": "27D",
    "start": "Villivakkam",
    "destination": "Foreshore Estate",
    "routeStops": "Santhome, AIR, V.M.Street, Stella Maris College, Thousand Lights, LIC, Pudhupet, Maternity Hospital, Egmore RS, Dasaprakash, Purasaiwakkam, Kellys, Ayanavaram, ICF",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Santhome",
      "AIR",
      "V.M.Street",
      "Stella Maris College",
      "Thousand Lights",
      "LIC",
      "Pudhupet",
      "Maternity Hospital",
      "Chennai Egmore",
      "Dasaprakash",
      "Purasaiwakkam",
      "Kellys",
      "Ayanavaram",
      "ICF",
      "Foreshore Estate"
    ]
  },
  {
    "busNo": "47",
    "start": "Villivakkam",
    "destination": "Thiruvanmiyur/ Adyar",
    "routeStops": "T.Nagar, Valluvar Kottam, Pushpa nagar,Loyola college, Anna Nagar East",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "T.Nagar",
      "Valluvar Kottam",
      "Pushpa nagar",
      "Loyola college",
      "Anna Nagar East",
      "Thiruvanmiyur/ Adyar"
    ]
  },
  {
    "busNo": "47B",
    "start": "Villivakkam",
    "destination": "Besant Nagar",
    "routeStops": "Avvai Home, Adyar B.S, T.Nagar, Anna Nagar East",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Avvai Home",
      "Adyar B.S",
      "T.Nagar",
      "Anna Nagar East",
      "Besant Nagar"
    ]
  },
  {
    "busNo": "T47",
    "start": "Villivakkam",
    "destination": "Tidel Park",
    "routeStops": "Madiakailash, Saidapet, T. Nagar, Anna Hospital, ICF",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Madiakailash",
      "Saidapet",
      "T. Nagar",
      "Anna Hospital",
      "ICF",
      "Tidel Park"
    ]
  },
  {
    "busNo": "65V",
    "start": "Villivakkam",
    "destination": "Poonamallee",
    "routeStops": "Nadhamuni, Padi, Ambattur I.E, Ambattur OT, Avadi, Karaiyanchavadi",
    "areaSection": "Villivakkam",
    "stops": [
      "Villivakkam",
      "Nadhamuni",
      "Padi",
      "Ambattur I.E",
      "Ambattur OT",
      "Avadi",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "29",
    "start": "Vinayagapu ram",
    "destination": "Mandaveli",
    "routeStops": "Kolahur, Agaram, Venus, Ptaaalam, Doveton, Egmore, L.I.C, Royapettah, Luz, Mylapore",
    "areaSection": "Vinayakapuram",
    "stops": [
      "Vinayagapu ram",
      "Kolahur",
      "Agaram",
      "Venus",
      "Ptaaalam",
      "Doveton",
      "Egmore",
      "L.I.C",
      "Royapettah",
      "Luz",
      "Mylapore",
      "Mandaveli"
    ]
  },
  {
    "busNo": "142",
    "start": "Vinayagapu ram",
    "destination": "Perambur",
    "routeStops": "",
    "areaSection": "Vinayakapuram",
    "stops": [
      "Vinayagapu ram",
      "Perambur"
    ]
  },
  {
    "busNo": "9M",
    "start": "T.Nagar",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Guindy, NGO Colony, Brindavan nagar, Kakkan Bridge",
    "areaSection": "AGS Colony",
    "stops": [
      "T.Nagar",
      "Saidapet",
      "Guindy",
      "NGO Colony",
      "Brindavan nagar",
      "Kakkan Bridge",
      "T.Nagar"
    ]
  },
  {
    "busNo": "519A",
    "start": "Aalathur IE",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Tidel park,Sholinganallur, Kelambakkam, Thirupporur",
    "areaSection": "Aalathur IE",
    "stops": [
      "Aalathur IE",
      "Saidapet",
      "Tidel park",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur",
      "T. Nagar"
    ]
  },
  {
    "busNo": "519A cut",
    "start": "Aalathur IE",
    "destination": "Adyar",
    "routeStops": "SRP tools, Sholinganallur, Kelambakkam, Thirupporur",
    "areaSection": "Aalathur IE",
    "stops": [
      "Aalathur IE",
      "SRP tools",
      "Sholinganallur",
      "Kelambakkam",
      "Thirupporur",
      "Adyar"
    ]
  },
  {
    "busNo": "54F xt",
    "start": "Agaram Mel",
    "destination": "Mylapore",
    "routeStops": "Poonamallee, Kumananchavadi, Iyyapanthangal, Porur, Guindy, Adayar",
    "areaSection": "Agaram Mel",
    "stops": [
      "Agaram Mel",
      "Poonamallee",
      "Kumananchavadi",
      "Iyyapanthangal",
      "Porur",
      "Guindy",
      "Adayar",
      "Mylapore"
    ]
  },
  {
    "busNo": "88R",
    "start": "Amarambe du",
    "destination": "High Court",
    "routeStops": "Gunidy, Porur, Kundrathur, Somangalam",
    "areaSection": "Amaramedu",
    "stops": [
      "Amarambe du",
      "Gunidy",
      "Porur",
      "Kundrathur",
      "Somangalam",
      "High Court"
    ]
  },
  {
    "busNo": "M89T",
    "start": "Amarambe du",
    "destination": "Iyyapanthangal",
    "routeStops": "Porur, Kundrathur",
    "areaSection": "Amaramedu",
    "stops": [
      "Amarambe du",
      "Porur",
      "Kundrathur",
      "Iyyapanthangal"
    ]
  },
  {
    "busNo": "170R",
    "start": "Andarkupp am",
    "destination": "CMBT",
    "routeStops": "Thirumangalam, Madhavaram, Kosappur",
    "areaSection": "Andar Kuppam",
    "stops": [
      "Andarkupp am",
      "Thirumangalam",
      "Madhavaram",
      "Kosappur",
      "CMBT"
    ]
  },
  {
    "busNo": "A1",
    "start": "Chennai Central",
    "destination": "Thiruvanmiyur",
    "routeStops": "Adyar, Mylapore, Royapettah",
    "areaSection": "Central Railway Station",
    "stops": [
      "Chennai Central",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "A1 xt",
    "start": "Chennai Central",
    "destination": "Okkiam Thorapakkam",
    "routeStops": "SRP Tools, Thiruvanmiyur, Adyar, Mylapor e, Royapettah",
    "areaSection": "Central Railway Station",
    "stops": [
      "Chennai Central",
      "SRP Tools",
      "Thiruvanmiyur",
      "Adyar",
      "Mylapore",
      "Royapettah",
      "Okkiam Thorapakkam"
    ]
  },
  {
    "busNo": "M21C",
    "start": "Chennai Central",
    "destination": "Kannagi Nagar",
    "routeStops": "Thoraipakkam, Perungudi, Thiruvanmiyur, Adayar, Mandaveli",
    "areaSection": "Central Railway Station",
    "stops": [
      "Chennai Central",
      "Thoraipakkam",
      "Perungudi",
      "Thiruvanmiyur",
      "Adayar",
      "Mandaveli",
      "Kannagi Nagar"
    ]
  },
  {
    "busNo": "221H",
    "start": "Chennai Central",
    "destination": "Thirupporur",
    "routeStops": "LIC,DMS, Saidapet,IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, Sholinganallur, SIRUSERI, Kelambakkam",
    "areaSection": "Central Railway Station",
    "stops": [
      "Chennai Central",
      "LIC",
      "DMS",
      "Saidapet",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "Sholinganallur",
      "SIRUSERI",
      "Kelambakkam",
      "Thirupporur"
    ]
  },
  {
    "busNo": "221H",
    "start": "Chennai Central",
    "destination": "Kelambakkam",
    "routeStops": "LIC,DMS, Saidapet,IIT Chennai, Madhya Kailash, Tidel Park, Thoraipakkam, Sholinganallur, SIRUSERI",
    "areaSection": "Central Railway Station",
    "stops": [
      "Chennai Central",
      "LIC",
      "DMS",
      "Saidapet",
      "IIT Chennai",
      "Madhya Kailash",
      "Tidel Park",
      "Thoraipakkam",
      "Sholinganallur",
      "SIRUSERI",
      "Kelambakkam"
    ]
  },
  {
    "busNo": "19D",
    "start": "Chemmenc hery",
    "destination": "Adyar",
    "routeStops": "Thiruvanmiyur, SRP, Perungudi",
    "areaSection": "Chemmenjery",
    "stops": [
      "Chemmenc hery",
      "Thiruvanmiyur",
      "SRP",
      "Perungudi",
      "Adyar"
    ]
  },
  {
    "busNo": "H21",
    "start": "Chemmenc hery",
    "destination": "Broadway",
    "routeStops": "Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Perungudi, Sholinganallur",
    "areaSection": "Chemmenjery",
    "stops": [
      "Chemmenc hery",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Broadway"
    ]
  },
  {
    "busNo": "G21",
    "start": "Chromepet",
    "destination": "Broadway",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Sanskrit College, Luz, Mylapore, Mandaveli BS, Adyar Gate, Kotturpuram, Anna university, Guindy, Pallavaram",
    "areaSection": "Chrompet",
    "stops": [
      "Chromepet",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Sanskrit College",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "Adyar Gate",
      "Kotturpuram",
      "Anna university",
      "Guindy",
      "Pallavaram",
      "Broadway"
    ]
  },
  {
    "busNo": "M21B",
    "start": "Chromepet",
    "destination": "Velachery",
    "routeStops": "Narayanapuram, Pallikaranai, Medavakkam, Santhosapuram, Sembakkam, Thirumalai Nagar, Hasthinapuram",
    "areaSection": "Chrompet",
    "stops": [
      "Chromepet",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Santhosapuram",
      "Sembakkam",
      "Thirumalai Nagar",
      "Hasthinapuram",
      "Velachery"
    ]
  },
  {
    "busNo": "70B",
    "start": "Chromepet Lakshmi",
    "destination": "Avadi",
    "routeStops": "Ambattur OT, Collector Nagar, CMBT, Vadapalani, Udhayam, Pallavaram",
    "areaSection": "Chrompet",
    "stops": [
      "Chromepet Lakshmi",
      "Ambattur OT",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Udhayam",
      "Pallavaram",
      "Avadi"
    ]
  },
  {
    "busNo": "44A",
    "start": "I.O.C (Indian Oil Corporation)",
    "destination": "Broadway",
    "routeStops": "Tondiarpet",
    "areaSection": "IOC",
    "stops": [
      "I.O.C (Indian Oil Corporation)",
      "Tondiarpet",
      "Broadway"
    ]
  },
  {
    "busNo": "44C",
    "start": "I.O.C",
    "destination": "Broadway",
    "routeStops": "Korukkupet",
    "areaSection": "IOC",
    "stops": [
      "I.O.C",
      "Korukkupet",
      "Broadway"
    ]
  },
  {
    "busNo": "44D",
    "start": "I.O.C",
    "destination": "Broadway",
    "routeStops": "Sathiyamoorthy Nagar",
    "areaSection": "IOC",
    "stops": [
      "I.O.C",
      "Sathiyamoorthy Nagar",
      "Broadway"
    ]
  },
  {
    "busNo": "170E",
    "start": "I.O.C",
    "destination": "Tambaram",
    "routeStops": "Korukkupettai, Kannadasan Nagar, Moolakadai, Retteri, Thirumangalam, CMBT, Vadapalani, Guindy, Pallavaram",
    "areaSection": "IOC",
    "stops": [
      "I.O.C",
      "Korukkupettai",
      "Kannadasan Nagar",
      "Moolakadai",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy",
      "Pallavaram",
      "Tambaram"
    ]
  },
  {
    "busNo": "PP19",
    "start": "Injambakkam",
    "destination": "Broadway",
    "routeStops": "Marina Beach, Thiruvanmiyur",
    "areaSection": "Injambakkam",
    "stops": [
      "Injambakkam",
      "Marina Beach",
      "Thiruvanmiyur",
      "Broadway"
    ]
  },
  {
    "busNo": "C51 cut",
    "start": "Injambakkam",
    "destination": "Tambaram West",
    "routeStops": "Camp Road, Kamarajapuram, Medavakkam, Sholinganallur, ECR",
    "areaSection": "Injambakkam",
    "stops": [
      "Injambakkam",
      "Camp Road",
      "Kamarajapuram",
      "Medavakkam",
      "Sholinganallur",
      "ECR",
      "Tambaram West"
    ]
  },
  {
    "busNo": "11G",
    "start": "K K Nagar",
    "destination": "High Court",
    "routeStops": "MGR Nagar, Ashok Pillar,Pangal Park, Annasalai, Central R.S, Parry's Corner",
    "areaSection": "K K Nagar",
    "stops": [
      "K K Nagar",
      "MGR Nagar",
      "Ashok Pillar",
      "Pangal Park",
      "Annasalai",
      "Chennai Central",
      "Parry's Corner",
      "High Court"
    ]
  },
  {
    "busNo": "12G",
    "start": "K K Nagar",
    "destination": "Anna Square",
    "routeStops": "MGR Nagar, Ashok Pillar, West Mambalam, Alwarpet, Luz",
    "areaSection": "K K Nagar",
    "stops": [
      "K K Nagar",
      "MGR Nagar",
      "Ashok Pillar",
      "West Mambalam",
      "Alwarpet",
      "Luz",
      "Anna Square"
    ]
  },
  {
    "busNo": "17D",
    "start": "K K Nagar",
    "destination": "Broadway",
    "routeStops": "Central, Egmore, DPI, Sterling Road, Valluvarkottam, Liberty, Udhayam, Nesapakkam",
    "areaSection": "K K Nagar",
    "stops": [
      "K K Nagar",
      "Central",
      "Egmore",
      "DPI",
      "Sterling Road",
      "Valluvarkottam",
      "Liberty",
      "Udhayam",
      "Nesapakkam",
      "Broadway"
    ]
  },
  {
    "busNo": "37D",
    "start": "KK Nagar",
    "destination": "V Nagar",
    "routeStops": "Regal, Choolai P.O., Purasaivakkam,KMC, Chetpet,Ste rling road, Valluvarkottam, Liberty, Samiarmadam, Udhayam, Nesapakkam, MGR Nagar",
    "areaSection": "K K Nagar",
    "stops": [
      "KK Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasaivakkam",
      "KMC",
      "Chetpet",
      "Ste rling road",
      "Valluvarkottam",
      "Liberty",
      "Samiarmadam",
      "Udhayam",
      "Nesapakkam",
      "MGR Nagar",
      "V Nagar"
    ]
  },
  {
    "busNo": "57F",
    "start": "Karanodai",
    "destination": "High Court",
    "routeStops": "Beach R.S, Stanley, Mint, Basin Bridge, Vyasarpadi, Moolakadai, Puzhal, Red hills",
    "areaSection": "Karanodai",
    "stops": [
      "Karanodai",
      "Chennai Beach",
      "Stanley",
      "Mint",
      "Basin Bridge",
      "Vyasarpadi",
      "Moolakadai",
      "Puzhal",
      "Red hills",
      "High Court"
    ]
  },
  {
    "busNo": "156",
    "start": "Karanodai",
    "destination": "Thiruvotriyur",
    "routeStops": "",
    "areaSection": "Karanodai",
    "stops": [
      "Karanodai",
      "Thiruvotriyur"
    ]
  },
  {
    "busNo": "56",
    "start": "Kargil Nagar",
    "destination": "Broadway",
    "routeStops": "V.Nagar, Tondiarpet, Thiruvottriyur, Sathyamoorthy nagar",
    "areaSection": "Kargil Nagar",
    "stops": [
      "Kargil Nagar",
      "V.Nagar",
      "Tondiarpet",
      "Thiruvottriyur",
      "Sathyamoorthy nagar",
      "Broadway"
    ]
  },
  {
    "busNo": "159K",
    "start": "Kargil Nagar",
    "destination": "CMBT",
    "routeStops": "Thiruvottriyur, Therady, Tollgate, Tondiarpet, V.Nagar, Regal, Choolai P.O., Purasawakkam High Road, Kellys, Aminjikarai, Arumbakkam",
    "areaSection": "Kargil Nagar",
    "stops": [
      "Kargil Nagar",
      "Thiruvottriyur",
      "Therady",
      "Tollgate",
      "Tondiarpet",
      "V.Nagar",
      "Regal",
      "Choolai P.O.",
      "Purasawakkam High Road",
      "Kellys",
      "Aminjikarai",
      "Arumbakkam",
      "CMBT"
    ]
  },
  {
    "busNo": "A1 xt",
    "start": "Kovalam",
    "destination": "Broadway",
    "routeStops": "Central, LIC, Royapettah, Luz, Mylapore, Mandaveli, AMS, Adyar, Thiruvanmiyur, Kottivakkam, Palavakkam, Neelangarai, Injambakkam, Uthandi, Kanathur, Muttukadu boat yard",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "Central",
      "LIC",
      "Royapettah",
      "Luz",
      "Mylapore",
      "Mandaveli",
      "AMS",
      "Adyar",
      "Thiruvanmiyur",
      "Kottivakkam",
      "Palavakkam",
      "Neelangarai",
      "Injambakkam",
      "Uthandi",
      "Kanathur",
      "Muttukadu boat yard",
      "Broadway"
    ]
  },
  {
    "busNo": "19G",
    "start": "Kovalam",
    "destination": "Broadway",
    "routeStops": "Central, LIC, DMS, SIET, Saidapet, Anna university, Adyar, Thiruvanmiyur, Kottivakkam, Palavakkam, Neelangarai, Injambakkam, Uthandi, Kanathur, Muttukadu boat yard",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "Central",
      "LIC",
      "DMS",
      "SIET",
      "Saidapet",
      "Anna university",
      "Adyar",
      "Thiruvanmiyur",
      "Kottivakkam",
      "Palavakkam",
      "Neelangarai",
      "Injambakkam",
      "Uthandi",
      "Kanathur",
      "Muttukadu boat yard",
      "Broadway"
    ]
  },
  {
    "busNo": "19V",
    "start": "Kovalam",
    "destination": "Velachery",
    "routeStops": "Taramani, SRP Tools, Jayanthi, Thiruvanmiyur, Injambakkam, MGM, Muttukadu",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "Taramani",
      "SRP Tools",
      "Jayanthi",
      "Thiruvanmiyur",
      "Injambakkam",
      "MGM",
      "Muttukadu",
      "Velachery"
    ]
  },
  {
    "busNo": "PP49",
    "start": "Kovalam",
    "destination": "CMBT",
    "routeStops": "MMDA Colony, Vadapalani, Liberty, T.Nagar, Saidapet, Adyar, Thiruvanmiyur, Kottivakkam, Palavakkam, Injambakkam, Kanathur, Muttukadu",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "MMDA Colony",
      "Vadapalani",
      "Liberty",
      "T.Nagar",
      "Saidapet",
      "Adyar",
      "Thiruvanmiyur",
      "Kottivakkam",
      "Palavakkam",
      "Injambakkam",
      "Kanathur",
      "Muttukadu",
      "CMBT"
    ]
  },
  {
    "busNo": "119",
    "start": "Kovalam",
    "destination": "Thiruvottriyur",
    "routeStops": "Broadway, Marina Beach, Thiruvanmiyur, Injambakkam",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "Broadway",
      "Marina Beach",
      "Thiruvanmiyur",
      "Injambakkam",
      "Thiruvottriyur"
    ]
  },
  {
    "busNo": "T151",
    "start": "Kovalam",
    "destination": "Tambaram East",
    "routeStops": "CampRoad, Medavakkam,Shozhinganallur, Navalur, Kelambakkam",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "CampRoad",
      "Medavakkam",
      "Shozhinganallur",
      "Navalur",
      "Kelambakkam",
      "Tambaram East"
    ]
  },
  {
    "busNo": "T151K",
    "start": "Kovalam",
    "destination": "Tambaram West",
    "routeStops": "CampRoad, Medavakkam, Shozhinganallur,Panaiyur, Uthandi, Kanathur, Muttukadu",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "CampRoad",
      "Medavakkam",
      "Shozhinganallur",
      "Panaiyur",
      "Uthandi",
      "Kanathur",
      "Muttukadu",
      "Tambaram West"
    ]
  },
  {
    "busNo": "517K",
    "start": "Kovalam",
    "destination": "Pallavaram",
    "routeStops": "Eachangadu, Kovilambakkam, Medavakkam Koot Road, Sholinganallur, Kelambakkam",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "Eachangadu",
      "Kovilambakkam",
      "Medavakkam Koot Road",
      "Sholinganallur",
      "Kelambakkam",
      "Pallavaram"
    ]
  },
  {
    "busNo": "566B",
    "start": "Kovalam",
    "destination": "Pattur",
    "routeStops": "Kundrathur, Anakaputhur, Pammal, Pallavaram, Chromepet, Tambaram Sanatorium, Tambaram, Perugalathur, Vandalur, Kandigai, Mambakkam, Pudhupakkam, Chettinad Hospital, Kelambakkam",
    "areaSection": "Kovalam",
    "stops": [
      "Kovalam",
      "Kundrathur",
      "Anakaputhur",
      "Pammal",
      "Pallavaram",
      "Chromepet",
      "Tambaram Sanatorium",
      "Tambaram",
      "Perugalathur",
      "Vandalur",
      "Kandigai",
      "Mambakkam",
      "Pudhupakkam",
      "Chettinad Hospital",
      "Kelambakkam",
      "Pattur"
    ]
  },
  {
    "busNo": "1G Cut",
    "start": "Madipakkam",
    "destination": "Broadway",
    "routeStops": "Velachery, Saidapet, TVS, LIC, Central",
    "areaSection": "Madipakkam",
    "stops": [
      "Madipakkam",
      "Velachery",
      "Saidapet",
      "TVS",
      "LIC",
      "Central",
      "Broadway"
    ]
  },
  {
    "busNo": "51E",
    "start": "Madipakkam BS",
    "destination": "Saidapet",
    "routeStops": "Velachery, Ram Nagar",
    "areaSection": "Madipakkam",
    "stops": [
      "Madipakkam BS",
      "Velachery",
      "Ram Nagar",
      "Saidapet"
    ]
  },
  {
    "busNo": "51M",
    "start": "Madipakkam BS",
    "destination": "T. Nagar",
    "routeStops": "Saidapet, Guindy, NGO Colony, ST Thomas Mount, Vanuvampet, Madipakkam Koot road",
    "areaSection": "Madipakkam",
    "stops": [
      "Madipakkam BS",
      "Saidapet",
      "Guindy",
      "NGO Colony",
      "ST Thomas Mount",
      "Vanuvampet",
      "Madipakkam Koot road",
      "T. Nagar"
    ]
  },
  {
    "busNo": "70D",
    "start": "Madipakka mB.S.",
    "destination": "Ambattur I.E",
    "routeStops": "Collector Nagar, CMBT, Vadapalani, Ashok Nagar, Guindy, Velachery, Ram Nagar",
    "areaSection": "Madipakkam",
    "stops": [
      "Madipakka mB.S.",
      "Collector Nagar",
      "CMBT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Velachery",
      "Ram Nagar",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "28A",
    "start": "Manali",
    "destination": "Chennai Egmore",
    "routeStops": "Andankuppam, Thiruvottriyur, Tollgate, Tondiarpet, Vallalarnagar, Regal, Central RS",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "Andankuppam",
      "Thiruvottriyur",
      "Tollgate",
      "Tondiarpet",
      "Vallalarnagar",
      "Regal",
      "Chennai Central",
      "Chennai Egmore"
    ]
  },
  {
    "busNo": "44",
    "start": "Manali",
    "destination": "Broadway",
    "routeStops": "V.Nagar",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "V.Nagar",
      "Broadway"
    ]
  },
  {
    "busNo": "56D",
    "start": "Manali",
    "destination": "Broadway",
    "routeStops": "Beach R.S, Thambuchetty St., Kalmandappam, Kasimedu, Tondirapet, Tollgate, Rajakadai, Thiruvotriyur R.S, Mattumandai",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "Chennai Beach",
      "Thambuchetty St.",
      "Kalmandappam",
      "Kasimedu",
      "Tondirapet",
      "Tollgate",
      "Rajakadai",
      "Thiruvotriyur R.S",
      "Mattumandai",
      "Broadway"
    ]
  },
  {
    "busNo": "M64C",
    "start": "Manali",
    "destination": "Broadway",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, Vyasarpadi, Pulianthope, Doveton, Central R.S",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "Vyasarpadi",
      "Pulianthope",
      "Doveton",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "121A",
    "start": "Manali",
    "destination": "CMBT",
    "routeStops": "Madhavaram Milk Colony, Thapal petti, Moolakadai, Retteri, Lucas, Thirumangalam",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "Madhavaram Milk Colony",
      "Thapal petti",
      "Moolakadai",
      "Retteri",
      "Lucas",
      "Thirumangalam",
      "CMBT"
    ]
  },
  {
    "busNo": "164C",
    "start": "Manali",
    "destination": "Broadway",
    "routeStops": "",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "Broadway"
    ]
  },
  {
    "busNo": "170C xt",
    "start": "Manali",
    "destination": "Guindy Estate",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, TVK Nagar, Retteri, Thirumangalam, CMBT, Vadapalani",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "TVK Nagar",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Guindy Estate"
    ]
  },
  {
    "busNo": "170M",
    "start": "Manali",
    "destination": "Velachery",
    "routeStops": "Madhavaram Milk colony, Thapal petti, Moolakadai, TVK Nagar, Retteri, Thirumangalam, CMBT, Vadapalani, Ashok pillar, Guindy, Checkpost",
    "areaSection": "Manali",
    "stops": [
      "Manali",
      "Madhavaram Milk colony",
      "Thapal petti",
      "Moolakadai",
      "TVK Nagar",
      "Retteri",
      "Thirumangalam",
      "CMBT",
      "Vadapalani",
      "Ashok pillar",
      "Guindy",
      "Checkpost",
      "Velachery"
    ]
  },
  {
    "busNo": "17B",
    "start": "Mangadu",
    "destination": "Broadway",
    "routeStops": "Paranipathur, Baikadai, Moulivakkam, Porur, Virugambakkam, Vadapalani, Gemini, Thousand lights, Central",
    "areaSection": "Mangadu",
    "stops": [
      "Mangadu",
      "Paranipathur",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Virugambakkam",
      "Vadapalani",
      "Gemini",
      "Thousand lights",
      "Central",
      "Broadway"
    ]
  },
  {
    "busNo": "53E",
    "start": "Mangadu",
    "destination": "Broadway",
    "routeStops": "Kumananchavadi, Mathruvayoil, Arumbakkam, Aminijikarai, KMC, Central R.S",
    "areaSection": "Mangadu",
    "stops": [
      "Mangadu",
      "Kumananchavadi",
      "Mathruvayoil",
      "Arumbakkam",
      "Aminijikarai",
      "KMC",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "54M",
    "start": "Mangadu",
    "destination": "High Court",
    "routeStops": "Paraniputhur, Baikadai, Moulivakkam, Porur, Guindy, Saidapet, DMS, TVS, LIC, Central R.S",
    "areaSection": "Mangadu",
    "stops": [
      "Mangadu",
      "Paraniputhur",
      "Baikadai",
      "Moulivakkam",
      "Porur",
      "Guindy",
      "Saidapet",
      "DMS",
      "TVS",
      "LIC",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "1G xt",
    "start": "Medavakkam",
    "destination": "Thiruvottiyur",
    "routeStops": "Velachery, Saidapet, TVS, LIC, Parry's Corner, Kalmandapam, Tollgate",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakkam",
      "Velachery",
      "Saidapet",
      "TVS",
      "LIC",
      "Parry's Corner",
      "Kalmandapam",
      "Tollgate",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "M14",
    "start": "Medavakkam Junction",
    "destination": "N.G.O Colony B.S",
    "routeStops": "Adambakkam, Vanuvampet, Ullagaram, Puzhithivakkam, Madipakkam Koot rd, Ganesh Nagar, Kilkattalai, Kovilambakkam, Vadakkupet, Vellaikal, Bell Nagar, Medavakkam",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakkam Junction",
      "Adambakkam",
      "Vanuvampet",
      "Ullagaram",
      "Puzhithivakkam",
      "Madipakkam Koot rd",
      "Ganesh Nagar",
      "Kilkattalai",
      "Kovilambakkam",
      "Vadakkupet",
      "Vellaikal",
      "Bell Nagar",
      "Medavakkam",
      "N.G.O Colony B.S"
    ]
  },
  {
    "busNo": "M14A",
    "start": "Medavakkam Koot Road",
    "destination": "Velachery",
    "routeStops": "Vanuvampettai, Madipakkam, Kilkattalai",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakkam Koot Road",
      "Vanuvampettai",
      "Madipakkam",
      "Kilkattalai",
      "Velachery"
    ]
  },
  {
    "busNo": "M15",
    "start": "Medavakkam",
    "destination": "Mylapore",
    "routeStops": "Adyar, Thiruvanmiyur, SRP Tools, Velachery, Pallikaranai",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakkam",
      "Adyar",
      "Thiruvanmiyur",
      "SRP Tools",
      "Velachery",
      "Pallikaranai",
      "Mylapore"
    ]
  },
  {
    "busNo": "B21xt",
    "start": "Medavakkam Koot Road",
    "destination": "Korukkupet",
    "routeStops": "V.Nagar, Parrys, Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Velacherry, Madipakkam Koot road, Kilkatalai, Kovilambakkam, Vellakal",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakkam Koot Road",
      "V.Nagar",
      "Parrys",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Velacherry",
      "Madipakkam Koot road",
      "Kilkatalai",
      "Kovilambakkam",
      "Vellakal",
      "Korukkupet"
    ]
  },
  {
    "busNo": "M21",
    "start": "Medavakka",
    "destination": "Velachery",
    "routeStops": "Narayanapuram, Pallikaranai,",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakka",
      "Narayanapuram",
      "Pallikaranai",
      "Velachery"
    ]
  },
  {
    "busNo": "D51",
    "start": "Medavakkam koot road",
    "destination": "High Court",
    "routeStops": "Medavakkam, Pallikkaranai, Velachery, Guindy Race Course, DMS, LIC, Central R.S",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakkam koot road",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "DMS",
      "LIC",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "D70 xt",
    "start": "Medavakkam",
    "destination": "Ambattur I.E",
    "routeStops": "Collector Nagar, Vadapalani, Ashok nagar, Guindy, Checkpost, Velacherry, Pallikaranai",
    "areaSection": "Medavakkam",
    "stops": [
      "Medavakkam",
      "Collector Nagar",
      "Vadapalani",
      "Ashok nagar",
      "Guindy",
      "Checkpost",
      "Velacherry",
      "Pallikaranai",
      "Ambattur I.E"
    ]
  },
  {
    "busNo": "17G",
    "start": "Mogalivakk am",
    "destination": "Broadway",
    "routeStops": "Kedar Hospital, Ramapuram, Angalamman Koil, Alwarthirunagar, Virugambakkam, Vadapalani, Gemini, Thousand lights, Central",
    "areaSection": "Mogalivakkam",
    "stops": [
      "Mogalivakk am",
      "Kedar Hospital",
      "Ramapuram",
      "Angalamman Koil",
      "Alwarthirunagar",
      "Virugambakkam",
      "Vadapalani",
      "Gemini",
      "Thousand lights",
      "Central",
      "Broadway"
    ]
  },
  {
    "busNo": "G17",
    "start": "Mogalivakk am",
    "destination": "Broadway",
    "routeStops": "Kedar Hospital,Porur, Valsarawakkam, Alwarthirunagar, Virugambakkam, Vadapalani, Gemini, Thousand lights, Central",
    "areaSection": "Mogalivakkam",
    "stops": [
      "Mogalivakk am",
      "Kedar Hospital",
      "Porur",
      "Valsarawakkam",
      "Alwarthirunagar",
      "Virugambakkam",
      "Vadapalani",
      "Gemini",
      "Thousand lights",
      "Central",
      "Broadway"
    ]
  },
  {
    "busNo": "M1A",
    "start": "Nanganallur",
    "destination": "Thiruvanmiyur",
    "routeStops": "SRP Tools, Velachery, Kaiveli, Ram Nagar, Madipakkam, Madipakkam Koot Road",
    "areaSection": "Nanganallur",
    "stops": [
      "Nanganallur",
      "SRP Tools",
      "Velachery",
      "Kaiveli",
      "Ram Nagar",
      "Madipakkam",
      "Madipakkam Koot Road",
      "Thiruvanmiyur"
    ]
  },
  {
    "busNo": "M18N",
    "start": "Nanganallur",
    "destination": "Guduvanchery",
    "routeStops": "Pazhavanthangal, Pallavaram, Chromepet, Tambaram, Vandalur Zoo, Oorapakkam",
    "areaSection": "Nanganallur",
    "stops": [
      "Nanganallur",
      "Pazhavanthangal",
      "Pallavaram",
      "Chromepet",
      "Tambaram",
      "Vandalur Zoo",
      "Oorapakkam",
      "Guduvanchery"
    ]
  },
  {
    "busNo": "M21G xt",
    "start": "Nanganallur",
    "destination": "Broadway",
    "routeStops": "Secretariat, Kannaki Statue, QMC, Kalyani Hospital, Luz, Mylapore, Mandaveli BS, Adyar Gate, Kotturpuram, Anna university, Guindy, Pazhavanthangal Station,",
    "areaSection": "Nanganallur",
    "stops": [
      "Nanganallur",
      "Secretariat",
      "Kannaki Statue",
      "QMC",
      "Kalyani Hospital",
      "Luz",
      "Mylapore",
      "Mandaveli BS",
      "Adyar Gate",
      "Kotturpuram",
      "Anna university",
      "Guindy",
      "Pazhavanthangal Station",
      "Broadway"
    ]
  },
  {
    "busNo": "M45B",
    "start": "Nanganallur",
    "destination": "Anna Square",
    "routeStops": "Saidapet, Nandanam, Teynampet, Alwarpet, Luz, Chennai Citi Centre",
    "areaSection": "Nanganallur",
    "stops": [
      "Nanganallur",
      "Saidapet",
      "Nandanam",
      "Teynampet",
      "Alwarpet",
      "Luz",
      "Chennai Citi Centre",
      "Anna Square"
    ]
  },
  {
    "busNo": "52L",
    "start": "Nanganallur",
    "destination": "High Court",
    "routeStops": "Aasargana, Guindy,Anna Salai",
    "areaSection": "Nanganallur",
    "stops": [
      "Nanganallur",
      "Aasargana",
      "Guindy",
      "Anna Salai",
      "High Court"
    ]
  },
  {
    "busNo": "129C",
    "start": "Nanganallur",
    "destination": "Perambur",
    "routeStops": "T.Nagar,Sterling Road,Chetpet,Otteri",
    "areaSection": "Nanganallur",
    "stops": [
      "Nanganallur",
      "T.Nagar",
      "Sterling Road",
      "Chetpet",
      "Otteri",
      "Perambur"
    ]
  },
  {
    "busNo": "154B",
    "start": "Nanganallur",
    "destination": "Poonamallee",
    "routeStops": "Kumanachavadi, Porur, Guindy,St.Thomas Mount,Vanuvampet",
    "areaSection": "Nanganallur",
    "stops": [
      "Nanganallur",
      "Kumanachavadi",
      "Porur",
      "Guindy",
      "St.Thomas Mount",
      "Vanuvampet",
      "Poonamallee"
    ]
  },
  {
    "busNo": "M2",
    "start": "Ottiambakk am",
    "destination": "Saidapet",
    "routeStops": "Velachery, Medavakkam",
    "areaSection": "Ottiyambakkam",
    "stops": [
      "Ottiambakk am",
      "Velachery",
      "Medavakkam",
      "Saidapet"
    ]
  },
  {
    "busNo": "C21",
    "start": "Ottiyambak kam",
    "destination": "Broadway",
    "routeStops": "Secretrariat, Anna Square, AIR, Santhome, Foreshore Estate, MRC Nagar, Adyar, SRP Tools, Perungudi, Sholinganallur, Perumbakkam, Nukkanpalayam, Arasan Kazhani",
    "areaSection": "Ottiyambakkam",
    "stops": [
      "Ottiyambak kam",
      "Secretrariat",
      "Anna Square",
      "AIR",
      "Santhome",
      "Foreshore Estate",
      "MRC Nagar",
      "Adyar",
      "SRP Tools",
      "Perungudi",
      "Sholinganallur",
      "Perumbakkam",
      "Nukkanpalayam",
      "Arasan Kazhani",
      "Broadway"
    ]
  },
  {
    "busNo": "51B xt",
    "start": "Ottiyambak kam",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Checkpost, Velachery, Narayanapuram, Pallikaranai, Medavakkam, Sithalapakkam koot road, Sithalapakkam, Arasan kazhani",
    "areaSection": "Ottiyambakkam",
    "stops": [
      "Ottiyambak kam",
      "Saidapet",
      "Checkpost",
      "Velachery",
      "Narayanapuram",
      "Pallikaranai",
      "Medavakkam",
      "Sithalapakkam koot road",
      "Sithalapakkam",
      "Arasan kazhani",
      "T.Nagar"
    ]
  },
  {
    "busNo": "M51C",
    "start": "Ottiambakk am",
    "destination": "T. Nagar",
    "routeStops": "Velachery, MEDAVAKKAM, Perumbakkam",
    "areaSection": "Ottiyambakkam",
    "stops": [
      "Ottiambakk am",
      "Velachery",
      "MEDAVAKKAM",
      "Perumbakkam",
      "T. Nagar"
    ]
  },
  {
    "busNo": "E51",
    "start": "Ottiambakk am",
    "destination": "High Court",
    "routeStops": "Arasan kazhani, Sithalapakkam, Sithalapakkam Koot road, Medavakkam, Pallikkaranai, Velachery,Guindy Race Course, DMS, LIC, Central R.S",
    "areaSection": "Ottiyambakkam",
    "stops": [
      "Ottiambakk am",
      "Arasan kazhani",
      "Sithalapakkam",
      "Sithalapakkam Koot road",
      "Medavakkam",
      "Pallikkaranai",
      "Velachery",
      "Guindy Race Course",
      "DMS",
      "LIC",
      "Chennai Central",
      "High Court"
    ]
  },
  {
    "busNo": "M51C",
    "start": "Ottiambakk am",
    "destination": "T.Nagar",
    "routeStops": "Arasan Kazhani, Nukkanpalayam, Perumbakkam, Medavakkam, Pallikaranai, Velacherry, Checkpost, Saidapet",
    "areaSection": "Ottiyambakkam",
    "stops": [
      "Ottiambakk am",
      "Arasan Kazhani",
      "Nukkanpalayam",
      "Perumbakkam",
      "Medavakkam",
      "Pallikaranai",
      "Velacherry",
      "Checkpost",
      "Saidapet",
      "T.Nagar"
    ]
  },
  {
    "busNo": "51J",
    "start": "Ponmar",
    "destination": "Broadway",
    "routeStops": "Central, LIC, DMS, SIET, Saidapet, CheckpostVelachery,Medavakkam,Sith alapakkam koot road,Kovilancherry,Madurapakkam",
    "areaSection": "Ponmar",
    "stops": [
      "Ponmar",
      "Central",
      "LIC",
      "DMS",
      "SIET",
      "Saidapet",
      "CheckpostVelachery",
      "Medavakkam",
      "Sith alapakkam koot road",
      "Kovilancherry",
      "Madurapakkam",
      "Broadway"
    ]
  },
  {
    "busNo": "51T",
    "start": "Ponmar",
    "destination": "Tambaram East",
    "routeStops": "Camp road, Balaji nagar, Thiruvancherry, Paduvancherry, Agaram then, Kovilancherry, Madurapakkam",
    "areaSection": "Ponmar",
    "stops": [
      "Ponmar",
      "Camp road",
      "Balaji nagar",
      "Thiruvancherry",
      "Paduvancherry",
      "Agaram then",
      "Kovilancherry",
      "Madurapakkam",
      "Tambaram East"
    ]
  },
  {
    "busNo": "536",
    "start": "Ponneri",
    "destination": "Pattabiram",
    "routeStops": "Avadi, Ambattur O.T., Pudhur, Puzhal, Red Hills",
    "areaSection": "Ponneri",
    "stops": [
      "Ponneri",
      "Avadi",
      "Ambattur O.T.",
      "Pudhur",
      "Puzhal",
      "Red Hills",
      "Pattabiram"
    ]
  },
  {
    "busNo": "558",
    "start": "Ponneri",
    "destination": "V.Nagar",
    "routeStops": "Red Hills, Karanodai",
    "areaSection": "Ponneri",
    "stops": [
      "Ponneri",
      "Red Hills",
      "Karanodai",
      "V.Nagar"
    ]
  },
  {
    "busNo": "562B",
    "start": "Ponneri",
    "destination": "Poonamallee",
    "routeStops": "Janappan chathram x Road, Karanodai, Red Hills, Puzhal, Ambattur OT, Avadi, Karaiyanchavadi",
    "areaSection": "Ponneri",
    "stops": [
      "Ponneri",
      "Janappan chathramx Road",
      "Karanodai",
      "Red Hills",
      "Puzhal",
      "Ambattur OT",
      "Avadi",
      "Karaiyanchavadi",
      "Poonamallee"
    ]
  },
  {
    "busNo": "10A",
    "start": "Saidapet West",
    "destination": "Tollgate",
    "routeStops": "Kal mandapam, Parrys, Central R.S, Egmore R.S, Maternity Hospital, DPI, Sterling road, Valluvar Kottam, Panagal park, T.Nagar, Srinivasa Theater, Mettupalayam",
    "areaSection": "Saidapet West",
    "stops": [
      "Saidapet West",
      "Kal mandapam",
      "Parrys",
      "Chennai Central",
      "Chennai Egmore",
      "Maternity Hospital",
      "DPI",
      "Sterling road",
      "Valluvar Kottam",
      "Panagal park",
      "T.Nagar",
      "Srinivasa Theater",
      "Mettupalayam",
      "Tollgate"
    ]
  },
  {
    "busNo": "18K",
    "start": "Saidapet W est",
    "destination": "Broadway",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Teynampet, Nandanam, CIT Nagar, Srinivasa, Mettupalayam",
    "areaSection": "Saidapet West",
    "stops": [
      "Saidapet W est",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Teynampet",
      "Nandanam",
      "CIT Nagar",
      "Srinivasa",
      "Mettupalayam",
      "Broadway"
    ]
  },
  {
    "busNo": "K18",
    "start": "Saidapet W est",
    "destination": "Broadway",
    "routeStops": "Central R.S, Simpson, LIC, TVS, DMS, Teynampet, Nandanam, Saidapet, Guindy, Ekkaduthangal,Ashok nagar, Mettupalayam",
    "areaSection": "Saidapet West",
    "stops": [
      "Saidapet W est",
      "Chennai Central",
      "Simpson",
      "LIC",
      "TVS",
      "DMS",
      "Teynampet",
      "Nandanam",
      "Saidapet",
      "Guindy",
      "Ekkaduthangal",
      "Ashok nagar",
      "Mettupalayam",
      "Broadway"
    ]
  },
  {
    "busNo": "88D",
    "start": "Saidapet West",
    "destination": "Kundrathur",
    "routeStops": "Koovoor, Periyapannicherry, Baikadai, Porur, Guindy, Saidapet, Srinivasa Theater",
    "areaSection": "Saidapet West",
    "stops": [
      "Saidapet West",
      "Koovoor",
      "Periyapannicherry",
      "Baikadai",
      "Porur",
      "Guindy",
      "Saidapet",
      "Srinivasa Theater",
      "Kundrathur"
    ]
  },
  {
    "busNo": "19K",
    "start": "Siruseri",
    "destination": "Adyar Bus Stand",
    "routeStops": "Thiruvanmiyur, Perungudi, Navalur, Thalambur",
    "areaSection": "Siruseri",
    "stops": [
      "Siruseri",
      "Thiruvanmiyur",
      "Perungudi",
      "Navalur",
      "Thalambur",
      "Adyar Bus Stand"
    ]
  },
  {
    "busNo": "570S",
    "start": "SiruseriSIP COT",
    "destination": "CMBT",
    "routeStops": "Vadapalani, Ashok Nagar, Guindy, Check post, Velachery, SRP tools, Perungudi, Sholinganallur, Navalur",
    "areaSection": "Siruseri",
    "stops": [
      "SiruseriSIP COT",
      "Vadapalani",
      "Ashok Nagar",
      "Guindy",
      "Check post",
      "Velachery",
      "SRP tools",
      "Perungudi",
      "Sholinganallur",
      "Navalur",
      "CMBT"
    ]
  },
  {
    "busNo": "5C",
    "start": "Taramani",
    "destination": "Broadway",
    "routeStops": "Madhya Kailash, Kotturpuram, Alwarpet, Royapettah, Chennai Central",
    "areaSection": "Tharamani",
    "stops": [
      "Taramani",
      "Madhya Kailash",
      "Kotturpuram",
      "Alwarpet",
      "Royapettah",
      "Chennai Central",
      "Broadway"
    ]
  },
  {
    "busNo": "5K",
    "start": "Taramani",
    "destination": "Mylapore",
    "routeStops": "",
    "areaSection": "Tharamani",
    "stops": [
      "Taramani",
      "Mylapore"
    ]
  },
  {
    "busNo": "5T",
    "start": "Taramani",
    "destination": "Vadapalani",
    "routeStops": "Saidapet, T.Nagar, Ashok pillar,",
    "areaSection": "Tharamani",
    "stops": [
      "Taramani",
      "Saidapet",
      "T.Nagar",
      "Ashok pillar",
      "Vadapalani"
    ]
  },
  {
    "busNo": "7K",
    "start": "Taramani",
    "destination": "T.Nagar",
    "routeStops": "Saidapet, Anna university, CPT, WPT,Tidel park",
    "areaSection": "Tharamani",
    "stops": [
      "Taramani",
      "Saidapet",
      "Anna university",
      "CPT",
      "WPT",
      "Tidel park",
      "T.Nagar"
    ]
  },
  {
    "busNo": "1J",
    "start": "Triplicane",
    "destination": "Thiruvottiyur",
    "routeStops": "Rajakadai, Tollgate, Kalmandappam, Pa rry's Corner, Central R.S",
    "areaSection": "Triplicane",
    "stops": [
      "Triplicane",
      "Rajakadai",
      "Tollgate",
      "Kalmandappam",
      "Pa rry's Corner",
      "Chennai Central",
      "Thiruvottiyur"
    ]
  },
  {
    "busNo": "13B",
    "start": "Triplicane",
    "destination": "T. Nagar",
    "routeStops": "Zambazzar, Express avenue, Royapettah, Gopalapuram playground, Thousand Lights, DMS, Pondy Bazzar, Panagal park",
    "areaSection": "Triplicane",
    "stops": [
      "Triplicane",
      "Zambazzar",
      "Express avenue",
      "Royapettah",
      "Gopalapuram playground",
      "Thousand Lights",
      "DMS",
      "Pondy Bazzar",
      "Panagal park",
      "T. Nagar"
    ]
  },
  {
    "busNo": "44B",
    "start": "Triplicane",
    "destination": "Manali New Town",
    "routeStops": "",
    "areaSection": "Triplicane",
    "stops": [
      "Triplicane",
      "Manali New Town"
    ]
  }
];
