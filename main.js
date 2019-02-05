class Ajax {
   constructor() {
      this.apiKey = 'e919922a-e3f5-4b05-9290-b62941d4b167';
   }

   async getBreedsList() {
      const url = 'https://api.thecatapi.com/v1/breeds';
      const breedsData = await fetch(url, {
         headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${this.apiKey}`
         }
      });

      const breeds = await breedsData.json();
      return {
         breeds
      };
   }

   async getCat(cat) {
      const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${cat}&api_key=${
         this.apiKey
      }`;
      const catData = await fetch(url);
      const cats = await catData.json();
      return cats;
   }
}

class Display {
   constructor() {
      this.results = document.querySelector('.results');
      this.breed = document.getElementById('breed');
      this.desc = document.getElementById('desc');
      this.origin = document.getElementById('origin');
      this.temp = document.getElementById('temp');
      // this.similar = document.getElementById('similar');
      this.id = document.getElementById('id');

      this.photo = document.getElementById('photo');
   }

   showCat(data) {
      data.forEach(() => {
         const div = document.createElement('div');
         const { name, origin, id, temperament, description } = data[0].breeds[0];

         div.innerHTML = `

         <p class='breed'><span id="breed">${name}</span></p>
         <p class="origin">origin: <span id="origin">${origin}</span></p>

         <p class="desc"><span id="desc">${description}</span></p>

         <img src="${data[0].url}" alt="${name}" id="photo" />
         <p class="temp" data-id='${id}'><span id="temp">${temperament}</span></p>
         <hr/>

         `;

         document.querySelector('.results').appendChild(div);
      });
   }

   showTemp(data) {
      const selectedTemp = tempOption.value;
      console.log(selectedTemp);
      const breeds = data.breeds;

      const filtered = [];
      // const similar = [];

      breeds.filter(function(breed) {
         if (breed.temperament.includes(selectedTemp)) {
            filtered.push(breed.id);
            // similar.push(breed.name);
         }
      });
      this.showGroup(filtered);
   }

   showGroup(filtered) {
      console.log(filtered);

      filtered.forEach(one => {
         ajax.getCat(one).then(data => display.showCat(data));
      });
   }
}

class UI {
   constructor() {
      this.init();
   }

   init() {
      this.populateTemperament();
   }

   populateTemperament() {
      ajax.getBreedsList().then(data => {
         const breeds = data.breeds;
         const select = document.getElementById('temperament');

         let tempArr = [];
         for (let i = 0; i < breeds.length; i++) {
            tempArr.push(breeds[i].temperament.split(', '));
         }

         let singleTrait = tempArr
            .flat()
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort();

         //extract single temperament traits
         singleTrait.forEach(single => {
            const option = document.createElement('option');
            option.value = single;
            option.appendChild(document.createTextNode(single));
            select.size = select.length;
            select.appendChild(option);
         });
      });
   }
}

const ajax = new Ajax();
const ui = new UI();
const display = new Display();

const form = document.getElementById('inputForm');
const tempOption = document.getElementById('temperament');

form.addEventListener('change', () => {
   const selectedTemp = tempOption.value;
   const results = document.querySelector('.results');
   while (results.firstChild) results.removeChild(results.firstChild); //clear previous results

   if (selectedTemp === 'empty') {
      const headers = document.createElement('div');
      headers.classList.add('headers');
      headers.innerHTML = `
      <h1>Looks</h1>
      <h1>&latail; or &ratail;</h1>
      <h1>Personality?</h1>
      `;
      document.querySelector('.results').appendChild(headers);
   } else {
      ajax.getBreedsList(selectedTemp).then(data => display.showTemp(data));
   }
});
