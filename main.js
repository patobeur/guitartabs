"use strict";
const detectDevice = {
  deviceType: "inconnu",
  isTouchScreen: false,
  hasMouse: false,
  detectDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    // Test basique par User-Agent pour distinguer les types
    if (/mobile|android|iphone|ipod/.test(ua)) {
      return "smartphone";
    } else if (/ipad|tablet|kindle/.test(ua)) {
      return "tablette";
    } else if (/mac|windows|linux/.test(ua)) {
      return "écran";
    } else {
      return "autre";
    }
  },
  detectTouchSupport() {
    return (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      window.matchMedia('(pointer: coarse)').matches
    );
  },
  detectMouseSupport() {
    return window.matchMedia('(pointer: fine)').matches;
  },
  analyser() {
    this.deviceType = this.detectDeviceType();
    this.isTouchScreen = this.detectTouchSupport();
    this.hasMouse = this.detectMouseSupport();
	this.texte = this.deviceType + (this.isTouchScreen?'+tactile':'+non tactile') + (this.hasMouse?'+souris':'')
  }
};
function deleteChord() {
  if (modal.index !== null) {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer cet accord ?");
    if (confirmDelete) {
      jsonManager.datas.splice(modal.index, 1);
      localStorage.setItem("accords", JSON.stringify(jsonManager.datas));
      modal.closeModal();
      location.reload();
    }
  }
}

const rules = {
	version: 0.01,
	notes: {
		us: ['A','B','C','D','E','F','G'],
		fr: ['La','Si','Do','Ré','Mi','Fa','Sol']
	},
	familles: [], // futures categories d'accords ?
	fr2us:function(note){
		return this.notes.us[this.notes.fr.indexOf(note)];
	},
	us2fr:function(note){
		return this.notes.fr[this.notes.us.indexOf(note)];
	},
}

const displaySize = {
	displayed:false,
	sizeDiv:document.createElement('div'),
	init:function(){
		this.sizeDiv.className='screensize';
		document.body.append(this.sizeDiv);
		this.sizeDiv.textContent=detectDevice.texte+':'+window.innerWidth+' x '+window.innerHeight;
		window.addEventListener("resize",(event)=>{
			this.sizeDiv.textContent= detectDevice.texte+':'+window.innerWidth+' x '+window.innerHeight
			this.sizeDiv.classList.add('displayed')
			if(!this.displayed){
				setTimeout(() => {
					this.displayed=false;
					this.sizeDiv.classList.remove('displayed')
				}, 2000);
			}
			this.displayed=true
		});
	}
}

// const displaySize = {sizeDiv:document.createElement('div'),init:function(){this.sizeDiv.className='screensize';document.body.append(this.sizeDiv);this.sizeDiv.textContent=device.device+':'+window.innerWidth+' x '+window.innerHeight;window.addEventListener("resize",(event)=>{this.sizeDiv.textContent= device.device+':'+window.innerWidth+' x '+window.innerHeight});}}
const jsonManager = {
	fileNamePath:"accords.json",
	dynamique:true,// localstorage activé
	datas:null,
	storedDatas:null,
	json:null,
	// set:function(datasChords){
	// 	this.datas = datasChords
	// 	// this.json = JSON.stringify(this.datas)
	// 	this.saveDatas()
	// },
	saveDatas:function(){
		this.json = JSON.stringify(this.datas)
		localStorage.setItem("accords", this.json);
	},
	init:function(){
		// STORAGE
		this.storedDatas = localStorage.getItem("accords")

		if (this.dynamique && this.storedDatas) {
			
			this.datas = JSON.parse(this.storedDatas)
			displayManager.start()
		} else {
			
				this.datas = lesAccords
				this.saveDatas()
				displayManager.start()

			// fetch(this.fileNamePath)
			// .then(response => response.json())
			// .then(datasChords => {
			// 	this.datas = datasChords
			// 	this.saveDatas()
			// 	displayManager.start()
			// });
		}
	},
	exportJSON:function(){
		let json = JSON.stringify(this.datas, null, 2)
		const blob = new Blob([json], { type: 'application/json' });
			console.log('Exported json')
			console.log(json)
			json = null
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'accords.json';
		a.click();
		// on vide url
		URL.revokeObjectURL(url);
	},
	importJSON:function(event){
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) =>{
			try {
				const imported = JSON.parse(e.target.result);
				if (Array.isArray(imported)) {
					this.datas = imported;
					console.log('Imported json')
					console.log(this.datas)
					this.saveToLocalStorage();
					location.reload();
				} else {
					alert('Fichier JSON invalide.');
				}
			} catch (err) {
				alert(err);
			}
		};
		reader.readAsText(file);
	},
	saveToLocalStorage:function() {
		localStorage.setItem("accords", JSON.stringify(this.datas));
	}
}
const svgManager = {
	createChordSVG:function(item){
		if (item.tab) {
			let fretStart = (item.barre && item.barre.fret) ? item.barre.fret : 1;
			const svgNS = "http://www.w3.org/2000/svg";
			const svg = document.createElementNS(svgNS, "svg");
			svg.setAttribute("viewBox", "0 0 60 60");
			// Le dessin du barré si y'en a un
			if (item.barre && item.barre.fret && fretStart && item.barre.from && item.barre.to) {
				const barreY = 10 + (item.barre.fret - fretStart) * 10 + 5;
				const xStart = 10 + (6 - item.barre.from) * 8;
				const xEnd = 10 + (6 - item.barre.to) * 8;
				const rect = document.createElementNS(svgNS, "rect");
				rect.setAttribute("y", barreY - 3);
				rect.setAttribute("x", Math.min(xStart, xEnd) - 3); // décale vers la gauche
				rect.setAttribute("width", Math.abs(xEnd - xStart) + 6); // augmente la largeur
				rect.setAttribute("height", 6);
				rect.setAttribute("fill", "black");
				rect.setAttribute("rx", 3);  // rayon horizontal
				rect.setAttribute("ry", 3);  // rayon vertical
				svg.appendChild(rect);
			}
			// Affiche le numéro de frette si > 1
			if (fretStart >= 0) {
				const text = document.createElementNS(svgNS, "text");
				text.setAttribute("x", 2);
				text.setAttribute("y", 17);
				text.setAttribute("font-size", "6");
				text.textContent = fretStart;
				svg.appendChild(text);
			}
			// Marqueurs au-dessus des cordes (X ou O)
			item.tab.forEach((fret, i) => {
				const x = 10 + i * 8;
				const y = 8;
				const marker = document.createElementNS(svgNS, "text");
				marker.setAttribute("x", x - 2);
				marker.setAttribute("y", y);
				marker.setAttribute("font-size", "5");
				if (fret === null) {
					marker.textContent = "x";
				} else if (fret === 0) {
					marker.textContent = "o";
				}
				if (marker.textContent) svg.appendChild(marker);
			});
			// Les Cordes (verticales)
			for (let i = 0; i < 6; i++) {
				const line = document.createElementNS(svgNS, "line");
				line.setAttribute("x1", 10 + i * 8);
				line.setAttribute("y1", 10);
				line.setAttribute("x2", 10 + i * 8);
				line.setAttribute("y2", 60);
				line.setAttribute("stroke", "black");
				svg.appendChild(line);
			}
			// les Frettes (horizontales)
			for (let i = 0; i < 5; i++) {
				const line = document.createElementNS(svgNS, "line");
				line.setAttribute("x1", 10);
				line.setAttribute("y1", 10 + i * 10);
				line.setAttribute("x2", 10 + 5 * 8);
				line.setAttribute("y2", 10 + i * 10);
				line.setAttribute("stroke", "black");
				svg.appendChild(line);
			}
			// les points pour les doigts
			item.tab.forEach((fret, i) => {
				if (fret !== null && fret !== 'null' && fret > 0) {
					const y = 10 + (fret - fretStart) * 10 + 5;
					const x = 10 + i * 8;
					
					const circle = document.createElementNS(svgNS, "circle");
					circle.setAttribute("cx", x);
					circle.setAttribute("cy", y);
					circle.setAttribute("r", 3);
					circle.setAttribute("fill", "black");
					svg.appendChild(circle);

					// le numéro des doigts
					if(item.fingers){
						const numDoigt = document.createElementNS(svgNS, "text");
						numDoigt.setAttribute("x", x - 1.5);
						numDoigt.setAttribute("y", y + 2);
						numDoigt.setAttribute("font-size", "5");
						numDoigt.setAttribute("fill", "white");
						let doig = item.fingers[i]
							numDoigt.textContent = (doig!='null' && doig!=null) ? item.fingers[i] : '';
							svg.appendChild(numDoigt);
						}
				}
			});
			return svg;
		}
		return false;
	}
}
const displayManager = {
	cardsDiv:document.createElement('div'),
	init:function(){
		detectDevice.analyser()
		jsonManager.init()
		modal.init()
	},
	start: function(){
		this.displaycardsDiv(jsonManager.datas)
		displaySize.init()
	},
	displaycardsDiv: function(){
		this.cardsDiv.className = 'cards';
		let i = 0;
		jsonManager.datas.forEach(item => {
			this.creatChordCard(item, i);
			i++;
		});
		document.body.appendChild(this.cardsDiv);
	},
	creatChordCard:function(item,i){
		const card = document.createElement('div');
		card.className = 'card '+ item.famille.nom;
		card.addEventListener('click', (e) => {modal.openModal(i)})
		
		const divContent = document.createElement('div');
		divContent.className = 'card-content';
		card.appendChild(divContent);

		const family = document.createElement('div');
		family.className = 'family';
		family.textContent = item.famille.nom;
		divContent.appendChild(family);

		const chord = document.createElement('div');
		chord.className = 'chord';
		chord.textContent = item.accord;
		divContent.appendChild(chord);

		const noteFR = document.createElement('div');
		noteFR.className = 'note-fr';
		noteFR.textContent = rules.us2fr(item.accord[0]);
		divContent.appendChild(noteFR);

		if (item.tab) {
			let fretStart = 1;
			if (item.barre && item.barre.fret) {
				fretStart = item.barre.fret;
			}
			const svg = svgManager.createChordSVG(item);
			if(svg) divContent.appendChild(svg);
		}

		if(item.famille) {
			if(item.famille.structure) {
				const chordsfamille = document.createElement('div');
				chordsfamille.className = 'chordsfamille';
				let blocs = item.famille.structure
				
				let i = 0
				Object.entries(blocs).forEach(entry => {
					const [key, value] = entry;
					i++;
					let tempoDiv = document.createElement('div');
					tempoDiv.className = 'note_'+i;
					tempoDiv.textContent = value;
					tempoDiv.title = key;
					chordsfamille.appendChild(tempoDiv);
				});
				divContent.appendChild(chordsfamille);
			}
		}
		displayManager.cardsDiv.appendChild(card);
	},
	areChordsEqual:function(a, b) {
		const sameTab = JSON.stringify(a.tab) === JSON.stringify(b.tab);
		// const sameFret = a.fret_start === b.fret_start;
		const sameBarre = JSON.stringify(a.barre || {}) === JSON.stringify(b.barre || {});
		// return sameTab && sameFret && sameBarre;
		// return sameTab && sameBarre;
		if(sameTab){
			console.log(a.tab)
			console.log(b.tab)
			console.log('------')
		}
		return sameTab;
	}
}
const modal = {
	index:null,
	form:null,
	modal:null,
	formSubmit:function(e){
		const form = e.target;
		const newChord = {
			famille: {
				"nom":form.famille.value,
				"structure":{
					"NoteFondamentale": "F",
					"TierceMajeure": "A",
					"QuinteJuste": "C"
				}
			},
			accord: form.accord.value,
			type: form.type.value,
			// note: form.note.value,
			// fr: form.fr.value,
			tab: form.tab.value.split(',').map(x => (x.trim() === 'null' || x.trim() === '') ? 'null' : parseInt(x.trim())),
			fingers: form.fingers.value.split(',').map(x => (x.trim() === 'null' || x.trim() === '') ? 'null' : parseInt(x.trim())),
			// fret_start: parseInt(form.fret_start.value) || 1
		}
		if (form.barre.value) {
			const [fret, from, to] = form.barre.value.split('-').map(x => parseInt(x));
			newChord.barre = { fret, from, to };
		}
		if ( jsonManager.datas.some(
			(item, index) => {
				index !== this.index && displayManager.areChordsEqual(item, newChord);
			})
		) {
			alert("Cet accord existe déjà !");
			return;
		}
		if (this.index !== null) {
			console.log('modChord',newChord)
			jsonManager.datas[this.index] = newChord;
		} else {
			console.log('newChord',newChord)
			jsonManager.datas.push(newChord);
		}
		jsonManager.saveDatas();
		// jsonManager.init();
		location.reload();
		this.closeModal();
	},
	openModal:function(index){
    	this.index = index ?? null;

		if (this.index !== null) {
			const chord = jsonManager.datas[this.index];
			this.form.famille.value = chord.famille.nom;
			this.form.famille.structure = chord.famille.structure;
			this.form.accord.value = chord.accord;
			this.form.type.value = chord.type;
			// this.form.note.value = chord.note;
			// this.form.fr.value = chord.fr;
			this.form.tab.value = chord.tab ? chord.tab.join(',') : '0,0,0,0,0,0';
			this.form.fingers.value = chord.fingers ? chord.fingers.join(',') : '0,0,0,0,0,0';
			// this.form.fret_start.value = chord.fret_start || 1;
			this.form.barre.value = chord.barre ? `${chord.barre.fret}-${chord.barre.from}-${chord.barre.to}` : '';
		}
		else {
			this.form.reset();
		}
    	this.modal.style.display = 'flex';
	},
	closeModal:function() {
		this.index = null
		this.form.reset()
		this.modal.style.display = 'none'
	},
	init:function(){
		this.form = document.getElementById('editForm');
		this.modal = document.getElementById('modal');
		this.modal.addEventListener('submit',(e)=> {
			e.preventDefault();
			this.formSubmit(e);
		});
	}
}
const device = {
	device:'desktop',
	detect:function(){
		this.device = (/Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)) ? 'mobile' : 'desktop';
		document.body.classList.add(this.device)
		return this.device
	}
}
window.addEventListener("load",()=>displayManager.init());
