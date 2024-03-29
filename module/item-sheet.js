/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class ZweihanderItemSheet extends ItemSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
			classes: ["zweihander", "sheet", "item"],
			width: 600,
      height: 650,
      resizable: false,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".item-body", initial: "description"}]
		});
  }

  /** @override */
  get template() {
    const path = "systems/zweihander/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.data.type}-sheet.html`;
  }


  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    
    if (this.item.type === "weapon") {
      data.data.primaryAttributes = [ "Combat", "Brawn", "Agility", "Perception", "Intelligence", "Willpower", "Fellowship" ];
    }

    return data.data;
  }

  /* -------------------------------------------- */

  // /** @override */
  // _onDragOver(event) {
  //   event.preventDefault();

  //   return false;
  // }

  // /** @override */
  // async _onDrop(event) {
  //   event.preventDefault();
  // }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // this.form.ondrop = event => this._onDrop(event);
    // this.form.ondragover = event => this._onDragOver(event);

    // if (this.item.type === 'ancestry') {
    //   const ancestries = ["human", "elf", "dwarf", "gnome", "halfling", "ogre"]; // TODO: change this to an object -> "elf": /path/to/image.png

    //   ancestries.forEach(ancestry => {
    //     if (this.item.name.toLowerCase().includes(ancestry))
    //       html.find(".illustration").attr("src", "systems/zweihander/assets/" + ancestry + ".png");
    //   });
    // }

    // Add or Remove Attribute
    // html.find(".attributes").on("click", ".attribute-control", this._onClickAttributeControl.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Listen for click events on an attribute control to modify the composition of attributes in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
/*   async _onClickAttributeControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const attrs = this.object.data.data.attributes;
    const form = this.form;

    // Add new attribute
    if ( action === "create" ) {
      const nk = Object.keys(attrs).length + 1;
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.attributes.attr${nk}.key" value="attr${nk}"/>`;
      newKey = newKey.children[0];
      form.appendChild(newKey);
      await this._onSubmit(event);
    }

    // Remove existing attribute
    else if ( action === "delete" ) {
      const li = a.closest(".attribute");
      li.parentElement.removeChild(li);
      await this._onSubmit(event);
    }
  } */

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event, formData) {

    // Handle the free-form attributes list
    // const formAttrs = expandObject(formData).data.attributes || {};

    // console.log("ITEM >>> ", formAttrs);
    /*const attributes = Object.values(formAttrs).reduce((obj, v) => {
      let k = v["key"].trim();
      if ( /[\s\.]/.test(k) )  return ui.notifications.error("Attribute keys may not contain spaces or periods");
      delete v["key"];
      obj[k] = v;
      return obj;
    }, {});
    
    // Remove attributes which are no longer used
    for ( let k of Object.keys(this.object.data.data.attributes) ) {
      if ( !attributes.hasOwnProperty(k) ) attributes[`-=${k}`] = null;
    }

    // Re-combine formData
    formData = Object.entries(formData).filter(e => !e[0].startsWith("data.attributes")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {_id: this.object._id, "data.attributes": attributes});
    */
    // Update the Item
    return this.object.update(formData);
  }
}
