const request = require('../utils/server');

function checkServerStatus(callback) {
  request('/status', callback);
}

function fetchBannerContent(callback) {
  request('/banner', (err, content) => {
    const banner = { ...content };
    banner.copyrightYear = 2022;
    callback(null, banner);
  });
}

function fetchAllOwners(callback) {
  request('/owners', (err, content) => {
    const updatedList = content.map(owner => {
      return owner.toLowerCase();
    });

    callback(null, updatedList);
  });
}

function fetchCatsByOwner(owner, callback) {
  request(`/owners/${owner}/cats`, (err, content) => {
    if (err) callback(err);
    else {
      callback(err, content);
    }
  });
}

function fetchCatPics(arr, callback) {
  let updatedCatPics = [];
  if (arr.length === 0) {
    callback(null);
  }
  for (let i = 0; i < arr.length; i++) {
    request(`/pics/${arr[i]}`, (err, responses) => {
      if (err) {
        updatedCatPics.push('placeholder.jpg');
      } else {
        updatedCatPics.push(responses);
      }
      if (updatedCatPics.length === arr.length) callback(null, updatedCatPics);
    });
  }
}

function fetchAllCats(callback) {
  let allCatsArr = [];

  fetchAllOwners((err, owners) => {
    if (err) callback(err);
    for (let i = 0; i < owners.length; i++) {
      fetchCatsByOwner(owners[i], (err, cats) => {
        if (err) callback(err);
        allCatsArr.push(cats);
        if (allCatsArr.length === owners.length) {
          const sortedFlatArr = allCatsArr.flat().sort();
          callback(err, sortedFlatArr);
        }
      });
    }
  });
}

function fetchOwnersWithCats(callback) {
  let ownerANDCatObjectArray = [];
  let count = 0;
  fetchAllOwners((err, ownersList) => {
    err && callback(err);
    ownersList.forEach((owner, index) => {
      fetchCatsByOwner(ownersList[index], (err, cats) => {
        err && callback(err);
        ownerANDCatObjectArray[index] = { owner: ownersList[index], cats: cats };
        count++;
        if (count === ownersList.length) {
          console.log(ownerANDCatObjectArray);
          callback(null, ownerANDCatObjectArray);
        }
      });
    });
  });
}

function kickLegacyServerUntilItWorks(callback) {
  request('/legacy-status', (err, response) => {
    err && callback(err);
    response === '200 - the legacy server is up'
      ? callback(null, response)
      : callback(null, kickLegacyServerUntilItWorks(callback));
  });
}

function buySingleOutfit() {}

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
