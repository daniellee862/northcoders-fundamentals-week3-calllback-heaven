const request = require('../utils/server');





function checkServerStatus(callback) {
  request("/status", callback)
}




function fetchBannerContent(callback) {
  request("/banner", (err, content) => {
    const banner = { ...content }
    banner.copyrightYear = 2022
    callback(null, banner)
  })
}



function fetchAllOwners(callback) {
  request("/owners", (err, content) => {
    const updatedList = content.map((owner) => {
      return owner.toLowerCase()
    })

    callback(null, updatedList)
  })
}


function fetchCatsByOwner(owner, callback) {
  request(`/owners/${owner}/cats`, (err, content) => {
    if (err) callback(err)
    else {
      callback(err, content)
    }

  })
}

function fetchCatPics(arr, callback) {
  let updatedCatPics = []
  if (arr.length === 0) {
    callback(null)
  }
  for (let i = 0; i < arr.length; i++) {
    request(`/pics/${arr[i]}`, (err, responses) => {
      if (err) {
        updatedCatPics.push("placeholder.jpg")
      } else {
        updatedCatPics.push(responses)
      }
      if (updatedCatPics.length === arr.length) callback(null, updatedCatPics)
    })
  }
}




function fetchAllCats(callback) {
  let allCatsArr = []
   
  fetchAllOwners((err, owners) => {
    if(err) callback(err);
    for (let i = 0; i < owners.length; i++) {
      fetchCatsByOwner(owners[i], (err, cats) => {
        if(err) callback(err);
        allCatsArr.push(cats)
        if (allCatsArr.length === owners.length) {
          const sortedFlatArr = allCatsArr.flat().sort()
          callback(err, sortedFlatArr)
        }
      })
    }
  })
}


// #### `fetchOwnersWithCats()`

// - this function should take a callback function as its only argument
// - this function should make use of `fetchAllOwners` and `fetchCatsByOwner` in order to build an
//   array of objects, each with an `owner` and `cats` key.
// - the order of the objects is critical, and must be preserved - however, sorting is incredibly inefficient. Maintain the correct order without sorting
// - you get the drill by now, but you must pass the array of cats and owners to the callback function

// fetchAllOwners = ['Pavlov', 'Schrodinger', 'Foucault', 'Vel', 'Calvin'];

// fetchCatsByOwner = {
//   schrodinger: ['Leben', 'Tot'],
//   pavlov: ['Belle', 'Dribbles', 'Nibbles'],
//   foucault: ['M. Fang'],
//   vel: ['Opal'],
//   calvin: ['Hobbes']
// };

function fetchOwnersWithCats() { 
  let allCatsObj = []
   
  fetchAllOwners((err, owners) => {
    if(err) callback(err);
    for (let i = 0; i < owners.length; i++) {

    }
  })
}

function kickLegacyServerUntilItWorks() { }

function buySingleOutfit() { }

module.exports = {
  buySingleOutfit,
  checkServerStatus,
  kickLegacyServerUntilItWorks,
  fetchAllCats,
  fetchCatPics,
  fetchAllOwners,
  fetchBannerContent,
  fetchOwnersWithCats,
  fetchCatsByOwner
};
