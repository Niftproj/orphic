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
        textElement: "data-otext",
        color: "data-ocolor",
        blurType: "data-oblur",
        blurRadius: "data-oblurrad",
        depth: "data-osh"
    }

    this._propsList = {
        color: "background-color",
    }

    this._classList = {
        parent: "o-orphic",
        blurLayer: "o-orphic-back",
        contentLayer: "o-orphic-layer",
        contentStroke: "o-orphic-stroke"
    }

    /* data-osel */
    this._defaultSelectors = {
        "th-odef-smoke" : "def_smoke"
    }

    this._depthList = {
        dropMode: 'o-drop',
        boxMode: 'o-box',
        textMode: 'o-text',
        innerMode: 'o-in',
        none: 'o-none'
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

    this._getDOM = (parent, target) => {
        /* get just from child only (i.e.: only 1 level) */
        let e = parent.querySelectorAll(target);

        for (let i = 0; i < parent.children.length; i++) {
            const element = parent.children[i];
            if(element.classList.contains(target))
            {
                return element;
            }
        }

        if(e.length > 0)
        {
            return e[0];
        }
        return null;
    }

    this._getOrph = (orph) => {
        return {
            parent: {
                element: orph,
            },
            blurLayer: {
                element: this._getDOM(orph, '.'+this._classList.blurLayer),
            },
            contentLayer: {
                element: this._getDOM(orph, '.'+this._classList.contentLayer),
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
                else if(val === 'back')
                {
                    // if(val === null)
                    // {
                    //     val = 'back';
                    // }
                    // let radius = this._getAttr(el.element, this._attrsList.blurRadius) || 10;
                    /** backdrop-filter(radius) on parent element */
                }
                else if(val === "none" || val === null)
                {
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

    this._parseDepthSyntax = (str) => {
        if(str !== null)
        {
            let fstr = '';
            var brac_opened = -1;
            for (let i = 0; i < str.length; i++) {
                if(str[i] === `(` && brac_opened === -1)
                {
                    brac_opened = i;
                }
                else if(str[i] === `)` && brac_opened != -1)
                {
                    brac_opened = -1;
                }

                // if(brac_opened !== -1 && str[i] === ',')
                // {
                //     fstr += '|';
                // }

                if(brac_opened !== -1)
                {
                    if(str[i] === ',')
                    {
                        fstr += '|';
                    }
                    else
                    {
                        fstr += str[i];
                    }
                }
                else
                {
                    fstr += str[i];
                }
            }

            let elements = fstr.split(",");
            let tree = new Object();
            elements.map((ell) => {
                let el = '';
                for (let i = 0; i < ell.length; i++) {
                    if(ell[i] === '|')
                    {
                        el += ',';
                    }
                    else
                    {
                        el += ell[i];
                    }
                }
                // console.log(el)
                let r = el.split(":");
                r.map((k, i) => {
                    r[i] = k.trim()
                });
                tree[r[0]] = r[1] === undefined ? "<unknown>" : r[1];
            });

            return tree;
        }
        else
        {
            return {};
        }
    }

    this._getDepthProps = (treeMap, theme) => {

        /// 4 is default
        return {
            left: treeMap['left'] ? treeMap['left'] : 4,
            right: treeMap['right'] ? treeMap['right'] : 4,
            top: treeMap['top'] ? treeMap['top'] : 4,
            bottom: treeMap['bottom'] ? treeMap['bottom'] : 4,
            blur: treeMap['blur'] ? treeMap['blur'] : 6,
            spread: treeMap['spread'] ? treeMap['spread'] : 0,
            /** @todo: get defaults from theme */
            color1: treeMap['color1'] ? treeMap['color1'] : `rgba(255, 255, 255, 1)`,
            color2: treeMap['color2'] ? treeMap['color2'] : `rgba(0, 0, 0, 0.1)`
        };

    }

    this._createCss = (el, inlines, type, orph, theme) => {
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
                else if(this._attrsList[k] === this._attrsList.depth && type==="parent")
                {
                    let depthVal = this._parseDepthSyntax(inlines[k]);
                    
                    // // is text element
                    // if(this._attrsList[k] === this._attrsList.textElement)
                    // {
                    //     console.log("I am text");
                    // }

                    if(depthVal[this._depthList.dropMode] === '<unknown>')
                    {
                        // console.log("DropShadow");
                        let depthProps = this._getDepthProps(depthVal, theme);
                        let val1 = `drop-shadow(-${depthProps.left}px -${depthProps.top}px ${depthProps.blur}px ${depthProps.color1})`;
                        let val2 = `drop-shadow(${depthProps.right}px ${depthProps.bottom}px ${depthProps.blur}px ${depthProps.color2})`;
                        let fval = `${val1} ${val2}`;
                        cssProps.push(this._styler.createProperty("filter", fval));
                    }
                    else if(depthVal[this._depthList.textMode] === '<unknown>')
                    {
                        // console.log("DropShadow");
                        let depthProps = this._getDepthProps(depthVal, theme);
                        let val1 = `-${depthProps.left}px -${depthProps.top}px ${depthProps.blur}px ${depthProps.color1}`;
                        let val2 = `${depthProps.right}px ${depthProps.bottom}px ${depthProps.blur}px ${depthProps.color2}`;
                        let fval = `${val1}, ${val2}`;
                        cssProps.push(this._styler.createProperty("text-shadow", fval));
                    }
                    else if(depthVal[this._depthList.innerMode] === '<unknown>')
                    {
                        // console.log("BoxShadow");
                        let depthProps = this._getDepthProps(depthVal, theme);
                        let val1 = `inset -${depthProps.left}px -${depthProps.top}px ${depthProps.blur}px ${depthProps.spread}px ${depthProps.color1}`;
                        let val2 = `inset ${depthProps.right}px ${depthProps.bottom}px ${depthProps.blur}px ${depthProps.spread}px ${depthProps.color2}`;
                        let fval = `${val1}, ${val2}`;
                        cssProps.push(this._styler.createProperty("box-shadow", fval));
                    }
                    else if(depthVal[this._depthList.boxMode] === '<unknown>')
                    {
                        // console.log("BoxShadow");
                        let depthProps = this._getDepthProps(depthVal, theme);
                        let val1 = `-${depthProps.left}px -${depthProps.top}px ${depthProps.blur}px ${depthProps.spread}px ${depthProps.color1}`;
                        let val2 = `${depthProps.right}px ${depthProps.bottom}px ${depthProps.blur}px ${depthProps.spread}px ${depthProps.color2}`;
                        let fval = `${val1}, ${val2}`;
                        cssProps.push(this._styler.createProperty("box-shadow", fval));
                    }
                    else if(depthVal[this._depthList.none] === '<unknown>')
                    {
                        // console.log("NoneShadow");
                    }
                    else
                    {
                        // console.log("DefaultShadow");
                    }
                    
                }
                else if(this._attrsList[k] === this._attrsList.blurType && type==="blur")
                {
                    
                    if(inlines[k] === "front")
                    {
                        // console.log("GotFront")
                        let radius = this._getAttr(el.element, this._attrsList.blurRadius) || 10;
                        let val = `blur(${radius}px)`;
                        cssProps.push(this._styler.createProperty("filter", val));
                    }
                    else if(inlines[k] === "back")
                    {
                        // console.log("GotBack")
                        let radius = this._getAttr(el.element, this._attrsList.blurRadius) || 10;
                        let val = `blur(${radius}px)`;
                        // cssProps.push(this._styler.createProperty("filter", val));
                        if(orph.contentLayer.element)
                        {
                            orph.contentLayer.element.style.backdropFilter = val;
                        }
                        /* Actually we have to do the blur on contentLayer */
                    }
                }
            }
            
        });

        return {cssClass, cssRule, cssProps};
    }

    this._generateCssRules = (orph, theme) => {
        
        // console.log(orph)

        let inlines = this._getElementInlineOverrides(orph.parent, true, theme);
        
        let parentCss = {};
        parentCss = this._createCss(orph.parent, inlines, "parent");
        
        this._styler.insertRule(parentCss.cssRule, parentCss.cssProps);
        orph.parent.element.classList.add(parentCss.cssClass);
        

        if(orph.blurLayer.element === null) return;
        let inlinesB = this._getElementInlineOverrides(orph.blurLayer, true, theme);
        // console.log(orph)

        let blurLayerCss = this._createCss(orph.blurLayer, inlinesB, "blur", orph, theme);

        // console.log(blurLayerCss)
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