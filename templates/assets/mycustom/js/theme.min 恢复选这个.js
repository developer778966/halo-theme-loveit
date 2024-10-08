class Util {
	forEach(e, t) {
		e = e || [];
		for (let n = 0; n < e.length; n++) t(e[n])
	}
	getScrollTop() {
		return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop
	}
	isMobile() {
		return window.matchMedia("only screen and (max-width: 680px)")
			.matches
	}
	isTocStatic() {
		return window.matchMedia("only screen and (max-width: 1200px)")
			.matches
	}
	animateCSS(e, t, n, s) {
		Array.isArray(t) || (t = [t]), e.classList.add("animated", ...t);
		const o = () => {
			e.classList.remove("animated", ...t), e.removeEventListener("animationend", o), typeof s == "function" && s()
		};
		n || e.addEventListener("animationend", o, !1)
	}
}
class Theme {
	constructor() {
		this.config = window.config, this.isDark = document.body.getAttribute("theme") === "dark", this.util = new Util, this.newScrollTop = this.util.getScrollTop(), this.oldScrollTop = this.newScrollTop, this.scrollEventSet = new Set, this.resizeEventSet = new Set, this.switchThemeEventSet = new Set, this.clickMaskEventSet = new Set, window.objectFitImages && objectFitImages()
	}
	initSVGIcon() {
		this.util.forEach(document.querySelectorAll("[data-svg-src]"), e => {
			fetch(e.getAttribute("data-svg-src"))
				.then(e => e.text())
				.then(t => {
					const s = document.createElement("div");
					s.insertAdjacentHTML("afterbegin", t);
					const n = s.firstChild;
					n.setAttribute("data-svg-src", e.getAttribute("data-svg-src")), n.classList.add("icon");
					const o = n.getElementsByTagName("title");
					o.length && n.removeChild(o[0]), e.parentElement.replaceChild(n, e)
				})
				.catch(e => {
					console.error(e)
				})
		})
	}
	/**
	initMenuMobile() {
		const e = document.getElementById("menu-toggle-mobile"),
			t = document.getElementById("menu-mobile");
		e.addEventListener("click", () => {
			document.body.classList.toggle("blur"), e.classList.toggle("active"), t.classList.toggle("active")
		}, !1), this._menuMobileOnClickMask = this._menuMobileOnClickMask || (() => {
			e.classList.remove("active"), t.classList.remove("active")
		}), this.clickMaskEventSet.add(this._menuMobileOnClickMask)
	} */
	initSwitchTheme() {
		this.util.forEach(document.getElementsByClassName("theme-switch"), e => {
			e.addEventListener("click", () => {
				document.body.getAttribute("theme") === "dark" ? document.body.setAttribute("theme", "light") : document.body.setAttribute("theme", "dark"), this.isDark = !this.isDark, window.localStorage && localStorage.setItem("theme", this.isDark ? "dark" : "light");
				for (let e of this.switchThemeEventSet) e()
			}, !1)
		})
	}
/**
	initSearch() {
		const e = this.config.search,
			o = this.util.isMobile();
		if (!e || o && this._searchMobileOnce || !o && this._searchDesktopOnce) return;
		const l = e.maxResultLength ? e.maxResultLength : 10,
			r = e.snippetLength ? e.snippetLength : 50,
			s = e.highlightTag ? e.highlightTag : "em",
			n = o ? "mobile" : "desktop",
			i = document.getElementById(`header-${n}`),
			c = document.getElementById(`search-input-${n}`),
			u = document.getElementById(`search-toggle-${n}`),
			a = document.getElementById(`search-loading-${n}`),
			t = document.getElementById(`search-clear-${n}`);
		o ? (this._searchMobileOnce = !0, c.addEventListener("focus", () => {
				document.body.classList.add("blur"), i.classList.add("open")
			}, !1), document.getElementById("search-cancel-mobile")
			.addEventListener("click", () => {
				i.classList.remove("open"), document.body.classList.remove("blur"), document.getElementById("menu-toggle-mobile")
					.classList.remove("active"), document.getElementById("menu-mobile")
					.classList.remove("active"), a.style.display = "none", t.style.display = "none", this._searchMobile && this._searchMobile.autocomplete.setVal("")
			}, !1), t.addEventListener("click", () => {
				t.style.display = "none", this._searchMobile && this._searchMobile.autocomplete.setVal("")
			}, !1), this._searchMobileOnClickMask = this._searchMobileOnClickMask || (() => {
				i.classList.remove("open"), a.style.display = "none", t.style.display = "none", this._searchMobile && this._searchMobile.autocomplete.setVal("")
			}), this.clickMaskEventSet.add(this._searchMobileOnClickMask)) : (this._searchDesktopOnce = !0, u.addEventListener("click", () => {
			document.body.classList.add("blur"), i.classList.add("open"), c.focus()
		}, !1), t.addEventListener("click", () => {
			t.style.display = "none", this._searchDesktop && this._searchDesktop.autocomplete.setVal("")
		}, !1), this._searchDesktopOnClickMask = this._searchDesktopOnClickMask || (() => {
			i.classList.remove("open"), a.style.display = "none", t.style.display = "none", this._searchDesktop && this._searchDesktop.autocomplete.setVal("")
		}), this.clickMaskEventSet.add(this._searchDesktopOnClickMask)), c.addEventListener("input", () => {
			c.value === "" ? t.style.display = "none" : t.style.display = "inline"
		}, !1);
		const d = () => {
			const i = autocomplete(`#search-input-${n}`, {
				hint: !1,
				autoselect: !0,
				dropdownMenuContainer: `#search-dropdown-${n}`,
				clearOnSelected: !0,
				cssClasses: {
					noPrefix: !0
				},
				debug: !0
			}, {
				name: "search",
				source: (n, o) => {
					a.style.display = "inline", t.style.display = "none";
					const i = e => {
						a.style.display = "none", t.style.display = "inline", o(e)
					};
					if (e.type === "lunr") {
						const t = () => {
							lunr.queryHandler && (n = lunr.queryHandler(n));
							const e = {};
							return this._index.search(n)
								.forEach(({
									ref: t,
									matchData: {
										metadata: n
									}
								}) => {
									const l = this._indexData[t];
									let {
										uri: a,
										title: c,
										content: o
									} = l;
									if (e[a]) return;
									let i = 0;
									Object.values(n)
										.forEach(({
											content: e
										}) => {
											if (e) {
												const t = e.position[0][0];
												(t < i || i === 0) && (i = t)
											}
										}), i -= r / 5, i > 0 ? (i += o.substr(i, 20)
											.lastIndexOf(" ") + 1, o = "..." + o.substr(i, r)) : o = o.substr(0, r), Object.keys(n)
										.forEach(e => {
											c = c.replace(new RegExp(`(${e})`, "gi"), `<${s}>$1</${s}>`), o = o.replace(new RegExp(`(${e})`, "gi"), `<${s}>$1</${s}>`)
										}), e[a] = {
											uri: a,
											title: c,
											date: l.date,
											context: o
										}
								}), Object.values(e)
								.slice(0, l)
						};
						this._index ? i(t()) : fetch(e.lunrIndexURL)
							.then(e => e.json())
							.then(n => {
								const s = {};
								this._index = lunr(function() {
									e.lunrLanguageCode && this.use(lunr[e.lunrLanguageCode]), this.ref("objectID"), this.field("title", {
										boost: 50
									}), this.field("tags", {
										boost: 20
									}), this.field("categories", {
										boost: 20
									}), this.field("content", {
										boost: 10
									}), this.metadataWhitelist = ["position"], n.forEach(e => {
										s[e.objectID] = e, this.add(e)
									})
								}), this._indexData = s, i(t())
							})
							.catch(e => {
								console.error(e), i([])
							})
					} else e.type === "algolia" && (this._algoliaIndex = this._algoliaIndex || algoliasearch(e.algoliaAppID, e.algoliaSearchKey)
						.initIndex(e.algoliaIndex), this._algoliaIndex.search(n, {
							offset: 0,
							length: l * 8,
							attributesToHighlight: ["title"],
							attributesToSnippet: [`content:${r}`],
							highlightPreTag: `<${s}>`,
							highlightPostTag: `</${s}>`
						})
						.then(({
							hits: e
						}) => {
							const t = {};
							e.forEach(({
								uri: e,
								date: n,
								_highlightResult: {
									title: s
								},
								_snippetResult: {
									content: o
								}
							}) => {
								if (t[e] && t[e].context.length > o.value) return;
								t[e] = {
									uri: e,
									title: s.value,
									date: n,
									context: o.value
								}
							}), i(Object.values(t)
								.slice(0, l))
						})
						.catch(e => {
							console.error(e), i([])
						}))
				},
				templates: {
					suggestion: ({
						title: e,
						date: t,
						context: n
					}) => `<div><span class="suggestion-title">${e}</span><span class="suggestion-date">${t}</span></div><div class="suggestion-context">${n}</div>`,
					empty: ({
						query: t
					}) => `<div class="search-empty">${e.noResultsFound}: <span class="search-query">"${t}"</span></div>`,
					footer: ({}) => {
						const {
							searchType: t,
							icon: n,
							href: s
						} = e.type === "algolia" ? {
							searchType: "algolia",
							icon: '<i class="fab fa-algolia fa-fw"></i>',
							href: "https://www.algolia.com/"
						} : {
							searchType: "Lunr.js",
							icon: "",
							href: "https://lunrjs.com/"
						};
						return `<div class="search-footer">Search by <a href="${s}" rel="noopener noreffer" target="_blank">${n} ${t}</a></div>`
					}
				}
			});
			i.on("autocomplete:selected", (e, t) => {
				window.location.assign(t.uri)
			}), o ? this._searchMobile = i : this._searchDesktop = i
		};
		if (e.lunrSegmentitURL && !document.getElementById("lunr-segmentit")) {
			const t = document.createElement("script");
			t.id = "lunr-segmentit", t.src = e.lunrSegmentitURL, t.async = !0, t.readyState ? t.onreadystatechange = () => {
				(t.readyState == "loaded" || t.readyState == "complete") && (t.onreadystatechange = null, d())
			} : t.onload = () => {
				d()
			}, document.body.appendChild(t)
		} else d()
	} */
	initDetails() {
		this.util.forEach(document.getElementsByClassName("details"), e => {
			const t = e.getElementsByClassName("details-summary")[0];
			t.addEventListener("click", () => {
				e.classList.toggle("open")
			}, !1)
		})
	}
	initLightGallery() {
		this.config.lightGallery && lightGallery(document.getElementById("content"), this.config.lightGallery)
	}
	initHighlight() {
		this.util.forEach(document.querySelectorAll(".highlight > pre.chroma"), e => {
			const t = document.createElement("div");
			t.className = e.className;
			const n = document.createElement("table");
			t.appendChild(n);
			const s = document.createElement("tbody");
			n.appendChild(s);
			const o = document.createElement("tr");
			s.appendChild(o);
			const i = document.createElement("td");
			o.appendChild(i), e.parentElement.replaceChild(t, e), i.appendChild(e)
		}), this.util.forEach(document.querySelectorAll(".highlight > .chroma"), e => {
			const t = e.querySelectorAll("pre.chroma > code");
			if (t.length) {
				const a = t[t.length - 1],
					s = document.createElement("div");
				s.className = "code-header " + a.className.toLowerCase();
				const o = document.createElement("span");
				o.classList.add("code-title"), o.insertAdjacentHTML("afterbegin", '<i class="arrow fas fa-chevron-right fa-fw"></i>'), o.addEventListener("click", () => {
					e.classList.toggle("open")
				}, !1), s.appendChild(o);
				const i = document.createElement("span");
				i.insertAdjacentHTML("afterbegin", '<i class="fas fa-ellipsis-h fa-fw"></i>'), i.classList.add("ellipses"), i.addEventListener("click", () => {
					e.classList.add("open")
				}, !1), s.appendChild(i);
				const n = document.createElement("span");
				n.insertAdjacentHTML("afterbegin", '<i class="far fa-copy fa-fw"></i>'), n.classList.add("copy");
				const r = a.innerText;
				if ((this.config.code.maxShownLines < 0 || r.split(`
`)
					.length < this.config.code.maxShownLines + 2) && e.classList.add("open"), this.config.code.copyTitle) {
					n.setAttribute("data-clipboard-text", r), n.title = this.config.code.copyTitle;
					const e = new ClipboardJS(n);
					e.on("success", e => {
						this.util.animateCSS(a, "flash")
					}), s.appendChild(n)
				}
				e.insertBefore(s, e.firstChild)
			}
		})
	}
	initTable() {
		this.util.forEach(document.querySelectorAll(".content table"), e => {
			const t = document.createElement("div");
			t.className = "table-wrapper", e.parentElement.replaceChild(t, e), t.appendChild(e)
		})
	}
	initHeaderLink() {
		for (let e = 1; e <= 6; e++) this.util.forEach(document.querySelectorAll(".single .content > h" + e), e => {
			e.classList.add("headerLink"), e.insertAdjacentHTML("afterbegin", `<a href="#${e.id}" class="header-mark"></a>`)
		})
	}
  
	initToc() {
    console.info("initToc");
		const e = document.getElementById("TableOfContents");
		if (e === null) return;
		if (document.getElementById("toc-static")
			.getAttribute("data-kept") || this.util.isTocStatic()) {
			const t = document.getElementById("toc-content-static");
			e.parentElement !== t && (e.parentElement.removeChild(e), t.appendChild(e)), this._tocOnScroll && this.scrollEventSet.delete(this._tocOnScroll)
		} else {
			const r = document.getElementById("toc-content-auto");
			e.parentElement !== r && (e.parentElement.removeChild(e), r.appendChild(e));
			const t = document.getElementById("toc-auto"),
				c = document.getElementsByClassName("page")[0],
				l = c.getBoundingClientRect();
			t.style.left = `${l.left+l.width+10}px`, t.style.maxWidth = `${c.getBoundingClientRect().left-10}px`, t.style.visibility = "visible";
			const i = e.querySelectorAll("a:first-child"),
				u = e.getElementsByTagName("li"),
				n = document.getElementsByClassName("headerLink"),
				s = document.body.getAttribute("data-header-desktop") !== "normal",
				o = document.getElementById("header-desktop")
				.offsetHeight,
        
				a = 20 + (s ? o : 0),
				d = t.offsetTop,
				h = d - a + (s ? 0 : o);
			this._tocOnScroll = this._tocOnScroll || (() => {
				const m = document.getElementById("post-footer")
					.offsetTop,
					l = m - t.getBoundingClientRect()
					.height,
					f = l - a + (s ? 0 : o);
				this.newScrollTop < h ? (t.style.position = "absolute", t.style.top = `${d}px`) : this.newScrollTop > f ? (t.style.position = "absolute", t.style.top = `${l}px`) : (t.style.position = "fixed", t.style.top = `${a}px`), this.util.forEach(i, e => {
					e.classList.remove("active")
				}), this.util.forEach(u, e => {
					e.classList.remove("has-active")
				});
				const c = 20 + (s ? o : 0);
				let r = n.length - 1;
				for (let e = 0; e < n.length - 1; e++) {
					const t = n[e].getBoundingClientRect()
						.top,
						s = n[e + 1].getBoundingClientRect()
						.top;
					if (e == 0 && t > c || t <= c && s > c) {
						r = e;
						break
					}
				}
				if (r !== -1) {
					i[r].classList.add("active");
					let t = i[r].parentElement;
					for (; t !== e;) t.classList.add("has-active"), t = t.parentElement.parentElement
				}
			}), this._tocOnScroll(), this.scrollEventSet.add(this._tocOnScroll)
		}
	}
	initMermaid() {
		const e = document.getElementsByClassName("mermaid");
		e.length && (mermaid.initialize({
			startOnLoad: !1,
			theme: "default"
		}), this.util.forEach(e, e => {
			mermaid.mermaidAPI.render("svg-" + e.id, this.data[e.id], t => {
				e.insertAdjacentHTML("afterbegin", t)
			}, e)
		}))
	}
	initEcharts() {
		this._echartsOnSwitchTheme = this._echartsOnSwitchTheme || (() => {
			this._echartsArr = this._echartsArr || [];
			for (let e = 0; e < this._echartsArr.length; e++) this._echartsArr[e].dispose();
			this._echartsArr = [], this.util.forEach(document.getElementsByClassName("echarts"), e => {
				const t = echarts.init(e, this.isDark ? "dark" : "macarons", {
					renderer: "svg"
				});
				t.setOption(JSON.parse(this.data[e.id])), this._echartsArr.push(t)
			})
		}), this.switchThemeEventSet.add(this._echartsOnSwitchTheme), this._echartsOnSwitchTheme(), this._echartsOnResize = this._echartsOnResize || (() => {
			for (let e = 0; e < this._echartsArr.length; e++) this._echartsArr[e].resize()
		}), this.resizeEventSet.add(this._echartsOnResize)
	}
	/**模拟打字和自动换行的效果
	initTypeit() {
		if (this.config.typeit) {
			const e = this.config.typeit,
				t = e.speed ? e.speed : 100,
				n = e.cursorSpeed ? e.cursorSpeed : 1e3,
				s = e.cursorChar ? e.cursorChar : "|";
			Object.values(e.data)
				.forEach(o => {
					const i = a => {
						const r = o[a],
							c = new TypeIt(`#${r}`, {
								strings: this.data[r],
								speed: t,
								lifeLike: !0,
								cursorSpeed: n,
								cursorChar: s,
								waitUntilVisible: !0,
								afterComplete: () => {
									if (a === o.length - 1) {
										e.duration >= 0 && window.setTimeout(() => {
											c.destroy()
										}, e.duration);
										return
									}
									c.destroy(), i(a + 1)
								}
							})
							.go()
					};
					i(0)
				})
		}
	} */
	initCookieconsent() {
		this.config.cookieconsent && cookieconsent.initialise(this.config.cookieconsent)
	}
	onScroll() {
		console.info("进入onScroll");
		const n = [];
		if (document.body.getAttribute("data-header-desktop") === "auto" && n.push(document.getElementById("header-desktop")), document.body.getAttribute("data-header-mobile") === "auto" && n.push(document.getElementById("header-mobile")), document.getElementById("comments")) {
			const e = document.getElementById("view-comments");
			e.href = `#comments`, e.style.display = "block"
		}
		const e = document.getElementById("fixed-buttons"),
			t = 20,
			s = 100;
		window.addEventListener("scroll", () => {
			this.newScrollTop = this.util.getScrollTop();
			const o = this.newScrollTop - this.oldScrollTop,
				i = this.util.isMobile();
			this.util.forEach(n, e => {
				o > t ? (e.classList.remove("fadeInDown"), this.util.animateCSS(e, ["fadeOutUp", "faster"], !0)) : o < -t && (e.classList.remove("fadeOutUp"), this.util.animateCSS(e, ["fadeInDown", "faster"], !0))
			}), this.newScrollTop > s ? i && o > t ? (e.classList.remove("fadeIn"), this.util.animateCSS(e, ["fadeOut", "faster"], !0)) : (!i || o < -t) && (e.style.display = "block", e.classList.remove("fadeOut"), this.util.animateCSS(e, ["fadeIn", "faster"], !0)) : (i || (e.classList.remove("fadeIn"), this.util.animateCSS(e, ["fadeOut", "faster"], !0)), e.style.display = "none");
			for (let e of this.scrollEventSet) e();
			this.oldScrollTop = this.newScrollTop
		}, !1)
	}
	onResize() {
		window.addEventListener("resize", () => {
			this._resizeTimeout || (this._resizeTimeout = window.setTimeout(() => {
				this._resizeTimeout = null;
				for (let e of this.resizeEventSet) e();
				this.initToc(), this.initMermaid()/**, this.initSearch() */
			}, 100))
		}, !1)
	}
	onClickMask() {
		document.getElementById("mask")
			.addEventListener("click", () => {
				for (let e of this.clickMaskEventSet) e();
				document.body.classList.remove("blur")
			}, !1)
	}
	init() {
    console.info("init");
		try {
			this.initSVGIcon(),   this.initSwitchTheme(),  this.initDetails(),  this.initHighlight(), this.initTable(), 
			this.initHeaderLink(), this.initMermaid(), this.initEcharts()
		} catch (e) {
			console.error(e)
		}
		window.setTimeout(() => {
			this.initToc(), this.onScroll(),  this.onResize(), this.onClickMask()
		}, 100)
	}
}
const themeInit = () => {
  console.info("themeInit");
	const e = new Theme;
	e.init()
};
document.readyState !== "loading" ? themeInit() : document.addEventListener("DOMContentLoaded", themeInit, !1)