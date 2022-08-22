function genRandom(length=4) {
    var keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var token = [];

        for(let i=0; i<length; i++)
        {
            var pos = (Math.random() * (keys.length-1)).toFixed(0);
            token[i] = keys[pos];
        }

        return token.join("");
}

function CSSStyleRules(el) {
    _this = this;
    this._htmlP = el;

    this.createRule = (type, selectorText) => {
        return {
            type: type,
            selectorText: selectorText
        };
    }

    this.createProperty = (name, val) => {
        return {
            propName: name,
            propVal: val
        };
    }

    this.insertRule = (rule = {}, props = []) => {
        
        let ruleLabel = rule.type === 'class' ? '.' : rule.type === 'id' ? '#' : rule.type === 'tag' ? '' : '';
        ruleLabel += rule.selectorText + '{';

        let properties = ``;
        props.map(prop => {
            properties += `${prop.propName}: ${prop.propVal};`;
        });

        let rendered_rule = `${ruleLabel} ${properties}}`;

        this._htmlP.innerHTML += rendered_rule;
    }
}

function OrphicUI() {

    var _this = this;

    this._styleElement = null;
    this._styler = null;

    this._isRendered = false;
    this._renderedOrphs = [];

    this._defaultThemes = {
        def_smoke: {
            name: "def_smoke",
            variant: "light",
            parentLayer: {
                color: {
                    r: 241,
                    g: 241,
                    b: 241,
                    a: 1
                },
                depths: [
                    {
                        name: "left_top",
                        type: "drop",
                        params: {
                            x: -4,
                            y: -4,
                            blur: 4,
                            spread: 0,
                            color: {
                                r: 255,
                                g: 255,
                                b: 255,
                                a: 0.67
                            }
                        }
                    },
                    {
                        name: "right_down",
                        type: "drop",
                        params: {
                            x: 4,
                            y: 4,
                            blur: 6,
                            spread: 0,
                            color: {
                                r: 0,
                                g: 0,
                                b: 0,
                                a: 0.13
                            }
                        }
                    }
                ]
            },
            layer: {
                color: {
                    r: 241,
                    g: 241,
                    b: 241,
                    a: 0.9
                },
                depths: []
            },
            ostroke: {
                color: {
                    r: 0,
                    g: 66,
                    f: 255,
                    a: 0.12
                },
                width: 1,
                borderType: 'solid'
            },
            layerBlurRadius: 9,
            borderRadius: 0
        }
    }

    this._attrsList = {
        theme: "data-osel",
        color: "data-ocolor",
        blurType: "data-oblur",
        blurRadius: "data-oblurrad"
    }

    this._propsList = {
        color: "background-color",
    }

    this._classList = {
        parent: "o-orphic",
        blurLayer: "o-orphic-back",
        contentLayer: "o-orphic-layer"
    }

    /* data-osel */
    this._defaultSelectors = {
        "th-odef-smoke" : "def_smoke"
    }

    this._themes = {};
    this._selectors = {};

    this._initCss = (doc = document) => {
        this._styleElement = doc.createElement('style');
        this._styleElement.type = 'text/css';

        this._styler = new CSSStyleRules(this._styleElement);
    }

    this.init = (doc = document) => {
        this._initCss(doc);
    }

    this.setThemes = (cl = {}) => {
        this._themes = cl;
    }

    this.setSelectors = (sel = {}) => {
        this._selectors = sel;
    }

    this._renderCss = (doc = document) => {
        doc.getElementsByTagName('head')[0].appendChild(this._styleElement);
    }

    this._getAttr = (el, attr='') => {
        return el.hasAttribute(attr) ? el.getAttribute(attr) : null;
    }

    this._getTheme = (osel_val) => {
        var osel = osel_val === null ? null : this._defaultSelectors[osel_val] ? this._defaultSelectors[osel_val] : this._selectors[osel_val] ? this._selectors[osel_val] : null;
        var selectedTheme = this._defaultThemes[osel] ? this._defaultThemes[osel] : this._themes[osel] ? this._themes[osel] : null;

        /* def_smoke is default */
        return selectedTheme === null ? this._defaultThemes["def_smoke"] : selectedTheme;
    }

    this._getOrph = (orph) => {
        return {
            parent: {
                element: orph,
            },
            blurLayer: {
                element: orph.querySelector('.'+this._classList.blurLayer),
            },
            contentLayer: {
                element: orph.querySelector('.'+this._classList.contentLayer),
            }
        };
    }

    this._getClassName = () => {
        return genRandom(4);
    }

    this._getElementInlineOverrides = (el, replaceNull, theme) => {

        let result = new Object();

        Object.keys(this._attrsList).map((key) => {

            let val = this._getAttr(el.element, this._attrsList[key]);

            if(this._attrsList[key] === this._attrsList.blurType)
            {
                if(val === 'front')
                {
                    // let radius = this._getAttr(el.element, this._attrsList.blurRadius) || 10;
                    // val = `blur(${radius}px)`;
                }
                else if(val === null || val === 'back')
                {
                    if(val === null)
                    {
                        val = 'back';
                    }
                    // let radius = this._getAttr(el.element, this._attrsList.blurRadius) || 10;
                    /** backdrop-filter(radius) on parent element */
                }
            }

            let rval = null;
            if(replaceNull === true && val === null)
            {
                if(this._attrsList[key] === this._attrsList.color)
                {
                    rval = `rgba(${theme.parentLayer.color.r}, ${theme.parentLayer.color.g}, ${theme.parentLayer.color.b}, ${theme.parentLayer.color.a})`;
                }
            }
            result[key] = replaceNull && val === null ? rval : val;
        });

        return result;
    }

    this._createCss = (el, inlines, type, orph) => {
        let cssClass = this._getClassName();
        let cssRule = this._styler.createRule("class", cssClass);
        let cssProps = [];
        Object.keys(inlines).map((k) => {
            if(inlines[k] !== null)
            {
                if(this._propsList[k])
                {
                    cssProps.push(this._styler.createProperty(this._propsList[k], inlines[k]));
                }
                else if(this._attrsList[k] === this._attrsList.blurType && type==="blur")
                {
                    
                    if(inlines[k] === "front")
                    {
                        let radius = this._getAttr(el.element, this._attrsList.blurRadius) || 10;
                        let val = `blur(${radius}px)`;
                        cssProps.push(this._styler.createProperty("filter", val));
                    }
                    else if(inlines[k] === "back")
                    {
                        let radius = this._getAttr(el.element, this._attrsList.blurRadius) || 10;
                        let val = `blur(${radius}px)`;
                        // cssProps.push(this._styler.createProperty("filter", val));
                        orph.contentLayer.element.style.backdropFilter = val;
                        /* Actually we have to do the blur on contentLayer */
                    }
                }
            }
            
        });

        return {cssClass, cssRule, cssProps};
    }

    this._generateCssRules = (orph, theme) => {
        
        let inlines = this._getElementInlineOverrides(orph.parent, true, theme);
        
        let parentCss = {};
        parentCss = this._createCss(orph.parent, inlines, "parent");
        
        this._styler.insertRule(parentCss.cssRule, parentCss.cssProps);
        orph.parent.element.classList.add(parentCss.cssClass);
        

        if(orph.blurLayer.element === null) return;
        let inlinesB = this._getElementInlineOverrides(orph.blurLayer, true, theme);
        console.log(orph)

        let blurLayerCss = this._createCss(orph.blurLayer, inlinesB, "blur", orph);

        console.log(blurLayerCss)
        this._styler.insertRule(blurLayerCss.cssRule, blurLayerCss.cssProps);
        orph.blurLayer.element.classList.add(blurLayerCss.cssClass);


        if(orph.contentLayer.element === null) return;
    }

    this.render = (doc = document) => {

        var orphs = document.getElementsByClassName(this._classList.parent);

        for (let i = 0; i < orphs.length; i++) {
            
            var orph = this._getOrph(orphs[i]);
            var selectedTheme = this._getTheme(this._getAttr(orph.parent.element, this._attrsList.theme));

            this._generateCssRules(orph, selectedTheme);

            this._renderedOrphs.push(orph);

        }

        this._isRendered = true;
        this._renderCss(doc);
    }

}