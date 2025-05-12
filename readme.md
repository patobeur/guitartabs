# 🎸 Guitar Tabs

**Guitar Tabs** est une application web minimaliste permettant de créer, modifier et gérer des accords de guitare.  
Elle offre une interface simple pour éditer les positions des doigts, ajouter des barrés et exporter/importer des accords au format JSON.

> 🧪 Projet 100% client-side – aucune base de données, aucune dépendance externe.

---

## 🔗 Démo en ligne

👉 [patobeur.github.io/guitartabs](https://patobeur.github.io/guitartabs/)

---

## ✨ Fonctionnalités

- ➕ Ajout d’accords personnalisés
- ✏️ Édition des positions des doigts (fingering)
- ➖ Ajout de barrés (barre chords)
- 💾 Export/Import des accords au format `.json`
- 🖥️ Interface responsive utilisable sur desktop et mobile

---

## 🖼️ Aperçu visuel

| Lecture des tablatures | Appli pédagogique | Tablature visuelle |
|------------------------|-------------------|--------------------|
| ![ex1](/vignettes/vignette.png) | ![ex2](/vignettes/vignette2.png) | ![ex3](/vignettes/vignette3.png) |

---

## 🛠️ Technologies utilisées

- 🧱 HTML5 / CSS3
- ⚙️ JavaScript Vanilla
- ❌ Aucune dépendance externe
- 📁 Application statique hébergée sur GitHub Pages
- 💽 Utilisation du LocalStorage pour sauvegarder les données côté client

---

## 📦 Installation locale

```bash
git clone https://github.com/patobeur/guitartabs.git
cd guitartabs
```

Puis ouvre simplement le fichier `index.html` dans ton navigateur préféré.

---

## 💡 Utilisation

1. Clique sur **"Ajouter un accord"** pour commencer.
2. Renseigne :
   - La **famille** de l’accord (ex : C, D, E…)
   - Le **type** (majeur, mineur, 7e, etc.)
   - La **position des doigts** : séparés par des virgules (ex : `x,3,2,0,1,0`)
   - Les **barrés** si besoin (ex : `1-3` pour barrer de la frette 1 à 3)
3. Clique sur **"Enregistrer"**.
4. Utilise les boutons **Exporter** / **Importer** pour sauvegarder ou charger tes accords.
5. 🛠️ La gestion de famille.structure n'est pas encore au point.

---

## 📁 Exemple de format JSON

```json
[
    {
        "accord": "C",
        "type": "majeur",
        "note": "C",
        "tab": [null,3,2,0,1,0],
        "barre": null,
        "fingers": [null,3,2,null,1,null],
        "famille": {
            "nom":"Triade",
            "structure":{
                "NoteFondamentale": "C",
                "TierceMajeure": "E",
                "QuinteJuste": "G"
            }
        }
    },
    ...
]
```

---

## 👨‍💻 Auteur

Développé en 🎶 par [@patobeur](https://github.com/patobeur)  
Développeur web et passionné de guitare.

---

## 🪪 Licence

Ce projet est distribué sous licence **MIT** – vous pouvez l’utiliser, le modifier et le partager librement.

---
