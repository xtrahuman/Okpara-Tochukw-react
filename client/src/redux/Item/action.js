import { v4 as uuidv4 } from 'uuid';
export const ADDATTRIBUTES = 'ITEM/ATTRIBUTES/ADD';
export const GETPRODUCT = 'ITEM/ATTRIBUTES/GET';

const addAttrib = (payload) => ({
  type: ADDATTRIBUTES,
  payload,
});

export const getProduct = (payload) => (
  {
    type: GETPRODUCT,
    payload,
  }
);

export const switchHandler = (selected, switchClass, attrib, value, addAttrib) => {
    const attribName = attrib.split(' ').join('');
    const parentElement = document.querySelectorAll(`.${attribName}`);
    parentElement.forEach((element) => {
      element.classList.forEach((classes) => {
        if (classes === switchClass) {
          element.classList.remove(switchClass);
        }
      });
    });
    const obj = {};
    obj[attribName] = value;
    addAttrib(obj);
    selected.classList.add(switchClass);
  }

  export const initialAttributesStyle = (addAttrib, attribClass) => {
    attribClass?.forEach(({ name }) => {
      const attribName = name.split(' ').join('');
      const getAtribEl = document.querySelectorAll(`.${attribName}`)[0];
      const value = getAtribEl.dataset.id;
      getAtribEl.classList.forEach((classl) => (classl === 'not-swatch' ? getAtribEl.classList.add('Active-not-swatch') : getAtribEl.classList.add('active-swatch')));
      const obj = {};
      obj[attribName] = value;
      addAttrib(obj);
    });
  }

  const compareObjects = (a, b) => {
    const recurseCheck = (objt) => Object.entries(objt).sort().map((i) => {
      if (i[1] instanceof Object) {
        i[1] = recurseCheck(i[1]);
      }
      return i;
    });
    const newA = { ...a };
    delete newA.count;
    delete newA.total;
    delete newA.cartId;
    delete newA.galleries;
    const newB = { ...b };
    delete newB.count;
    delete newB.total;
    delete newB.cartId;
    delete newB.galleries;
    return JSON.stringify(recurseCheck(newA)) === JSON.stringify(recurseCheck(newB));
  }

  export const handleAddLogic = (myItem, addAttrib, updateCart, addToCart, allCart, priceValue, attribClass, galleries) => {
  const obj = {};
  obj.cartId = uuidv4();
  obj.count = myItem.count;
  obj.count += 1;
  obj.total = obj.count * parseFloat(priceValue);
  obj.attributes = attribClass;
  obj.galleries = { gallery: [...galleries], currentGallery:galleries[0] };
  addAttrib(obj);
  const newObj = { ...myItem, ...obj };
  const newCart = [newObj];
  let counter = 0;
  const data = allCart.slice();
  const updatedCart = data.map((oldObj) => {
    if (compareObjects(oldObj, newObj)) {
      oldObj.count += 1;
      oldObj.total = oldObj.count * parseFloat(priceValue);
      counter += 1;
    }

    return oldObj;
  });

  if (counter < 1) {
    let newData = newCart.slice()
    addToCart(newData);
    counter = 0;
  } else {
    updateCart(updatedCart);
  }
}

export default addAttrib;
