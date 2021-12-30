/**
 * Define a set of handlebar helpers
 * @returns {Promise}
 */
export const registerHandlebarHelpers = async function () {
  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  const $$ = (name, fn) => Handlebars.registerHelper(name, fn);

  $$('$$', function(path) {
    return 'systems/zweihander/templates/' + path + '.hbs'
  })

  $$('getFirstLetter', function(word) {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase();
  });

  $$('capitalize', function(word) {
    if (typeof word !== 'string') return '';
    return word.capitalize();
  });

  $$('isMissing', function(toCheck, options) {
    if (!Array.isArray(toCheck))
      return toCheck === "" ? options.inverse(this) : options.fn(this);
    else
      return toCheck[0] === "" ? options.inverse(this) : options.fn(this);  // An empty input field results in first element of array becoming the empty String
  });

  $$('oddOrEven', function(idx) {
    if ((idx + 1) % 2)
      return "odd";
    else
      return "even";
  });

  $$('radioRanks', function(name, choices, options) {
    const checked = options.hash['checked'] || null;

    let html = "";
    let i = 0;
    for (let [key, label] of Object.entries(choices)) {
      const isChecked = checked === key;
      html += `<input type="radio" class="rd" name="${name}" id="${name + i}" value="${key}" ${isChecked ? "checked" : ""}><label for="${name + i++}">${label}</label>`;
    }

    return new Handlebars.SafeString(html);
  });

  $$('radioThresholds', function(name, choices, options) {
    const checked = options.hash['checked'] || null;
    const elem = options.hash['elem'] || "span"
    let html = "";
    let uuid = uuidv4();

    for (let [key, label] of Object.entries(choices)) {
      const isChecked = checked == key;
      html += `<div class="radio-and-status"><input type="radio" class="radio-rank" id="${uuid}.${key}" name="${name}" value="${key}" ${isChecked ? "checked" : ""}><${elem} for="${uuid}.${key}" class="status">${label}</${elem}></div>`;
    }

    return new Handlebars.SafeString(html);
  });

  $$('checkUniqueAdvanceType', function(type, associatedSkill) {
    if (type.trim().toLowerCase() === "focus") {
      return `Focus (${associatedSkill})`;
    } else {
      return type;
    }
  });

  $$('displayNpcSkillBonus', function(ranks) {
    let modifier = 0;

    for (let key of Object.keys(ranks)) {
      if (ranks[key].purchased) {
        modifier += 10;
      } else {
        break;
      }
    }

    return modifier !== 0 ? "+" + modifier : "";
  });

  $$('rpSettingOn', function(options) {
    return game.settings.get("zweihander", "trackRewardPoints") ? options.fn(this) : options.inverse(this);
  });

  $$('generateResultText', function(testResult, roll, totalChance, showFlip) {
    const flipString = showFlip ? "*" : "";

    switch (testResult) {
      case 0:
        return new Handlebars.SafeString(`<span class="failure">Critical Failure</span> (${roll} vs. ${totalChance})${flipString}`);
      case 1:
        return new Handlebars.SafeString(`<span class="failure">Failure</span> (${roll} vs. ${totalChance})${flipString}`);
      case 2:
        return new Handlebars.SafeString(`<span class="success">Success</span> (${roll} vs. ${totalChance})${flipString}`);
      case 3:
        return new Handlebars.SafeString(`<span class="success">Critical Success</span> (${roll} vs. ${totalChance})${flipString}`);
      default:
        break;
    }
  });

  $$('generateFlipText', function(flip) {
    return flip === "no-flip" ? "No" : (flip === "fail" ? "To Fail" : "To Succeed");
  });

  $$('checkSuccess', function(testResult, options) {
    return testResult >= 2 ? options.fn(this) : options.inverse(this);
  });

  $$('checkCriticalSuccess', function(testResult, options) {
    return testResult === 3 ? options.fn(this) : options.inverse(this);
  });

  $$('checkCriticalFailure', function(testResult, options) {
    return testResult === 0 ? options.fn(this) : options.inverse(this);
  });

  $$('displayIndividualDice', function(arrayOfDice, delimitator, highlight) {
    let expandedFormula = "";

    for (let d = 0; d < arrayOfDice.length; d++) {
      let results = arrayOfDice[d].results;

      for (let i = 0; i < results.length; i++) {
        if (highlight && results[i].result === 6)
          expandedFormula += `<a class="highlight" title="Generate Chaos Manifestation">` + results[i].result + "</a>";
        else
          expandedFormula += results[i].result;

        if (i !== results.length - 1) {
          expandedFormula += delimitator;
        }
      }

      if (d !== arrayOfDice.length - 1) {
        expandedFormula += delimitator;
      }
    }

    return new Handlebars.SafeString(expandedFormula);
  });

  $$('selectSpellDifficulty', function(optionIdx, principle) {
    switch (principle) {
      case "Petty":
      case "Generalist":
        return optionIdx === 0 ? "selected" : "";
      case "Lesser":
        return optionIdx === 1 ? "selected" : "";
      case "Greater":
        return optionIdx === 2 ? "selected" : "";
      default:
        break;
    }
  });
  
  $$('pa2Icon', function(key) {
    return {
      'combat': 'ra ra-croc-sword',
      'brawn': 'ra ra-muscle-up',
      'agility': 'fa fa-running',
      'perception': 'ra ra-aware',
      'intelligence': 'ra ra-book',
      'willpower': 'ra ra-crystal-ball',
      'fellowship': 'ra ra-double-team'
    }[key];
  })

  $$('markdownIt', function(md) {
    if (window.MEME?.markdownIt?.render) {
      return window.MEME?.markdownIt?.render(md)
    } else {
      return md;
    }
  })

  $$('itemTemplatePath', function(itemType) { 
    return 'systems/zweihander/templates/item/' + itemType + '.hbs';
  })

  $$('itemImageClass', function(img) {
    return img.endsWith(".svg") ? "item-image item-image-icon" : "item-image item-image-picture";
  })

  $$('itemImageStyle', function(img) {
    return img.endsWith(".svg") ? `-webkit-mask-image: url('${img}')` : `background-image: url('${img}')`;
  })

  $$('arrayInputGroup', function(label, target, array, max=Number.MAX_SAFE_INTEGER, pillDisplayProperty) {
    return `<div class="form-group">
    <label>${label}</label>
    <div class="array-input flexrow" data-array-input-target="${target}" data-array-input-max="${max}">
      <input name="proxy.${target}" type="text" placeholder="Enter values here">
      <button class="array-input-plus" type="button" tabindex="-1"><i class="fas fa-plus"></i></button>
      <div class="array-input-pills">
        ${array.map((v, i) => `
          <span class="array-input-pill" data-array-input-index="${i}">${v[pillDisplayProperty] ?? v}</span>
        `)}
      </div>
    </div>
  </div>`
  })

  $$('skillBonus', function(bonus) {
    return bonus ? `+${bonus}` : '';
  })

  $$('skillRankAbbreviation', function(rank) {
    return ['-', 'Appr.', 'Jour.', 'Mstr.'][rank];
  })

}