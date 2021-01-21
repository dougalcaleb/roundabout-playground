/*
✔ = Complete  ⚠ = Partial  ✖ = Incomplete
INTENDED FEATURES:
3 TYPES
✔ Normal
✖ Stack
✖ Fade
SPECS (NORMAL)
⚠ Can define page size and show however many fit or 
    define number to show and resize dynamically
✖ Can be all equal size or have an emphasized center slide
✖ Size falloff: center is biggest, and all side slides
    continually get smaller by set percentage
SPECS (STACK)
✖ Can determine direction
✖ Can have a parallax effect
SPECS (FADE)
✖  Can move and fade simultaneously
HAS AUTOSCROLL
✔ Scrolls over an interval
✔ Pauses on interaction or hover
✔ Can go either direction
PAGES
✔ Can be as simple as an image URL
✖ Support for interactive pages
✖ Can define HTML and CSS per page for interactivity
✔ Transition timings can be custom
✖ Supports as few as 2 pages
✔ Can scroll by a determined number of pages
SWIPE
✔ User can swipe to advance pages
✔ User can swipe past the edge and experience resistance
✔ A page always shows
✖ Inertia movement
BUBBLES
✔ Show current and available pages
✖ Entirely customizable
✔ Can be enabled/disabled
MISC
✔ User interactions can be throttled
✔ Keys can be used to navigate
✖ Scrolling through pages with bubbles is smooth
✔ Responsive
✔ Can have multiple carousels in a single page with object constructors
✔ Any relevant setting has a default, but can be overridden
✔ Unique class names
✔ Adding a new carousel appends without using innerHTML
✖ Errors are thrown when using incorrect settings for the type
INTERACTIVITY
✖ Selectors for different elements can be specified
RESPONSIVENESS
✖ Can be vertical
✖ Multiple breakpoints and value sets can be specified
EXTRA
✖ Presets for carousel visuals
✖ Presets for bubble visuals
✖ Which keys to include in navigation can be specified
SCRIPTING (after v1.0)
✖ onScroll(callback, includeAutoscroll)
✖ onScrollEnd(callback, includeAutoscroll)
✖ onDragStart(callback)
✖ onDragEnd(callback)
✖ onScrollRight(callback, includeAutoscroll)
✖ onScrollLeft(callback, includeAutoscroll)
✖ onScrollRightEnd(callback, includeAutoscroll)
✖ onScrollLeftEnd(callback, includeAutoscroll)
-  Change page stuff?
RELEASES
-  Each release has a .min file
-  Replace variables names with extremely short versions and letters where possible
-  Create a gitignored key file to easily replace variable names
-  Update checker with Github API (https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#list-releases)
Try to find a way to add "expansions": additional featuresets included in seperate files to reduce the total load size
-  scripting
-  presets pack
*/


//! KNOWN ISSUES:
/*
   
*/

// To do:
/*
-  TEST NEW .MIN
-  Per-page HTML & CSS
-  Size falloff
-  Minimal pages support
-  Page size setting
*/

let roundabout = {
	on: -1,
	usedIds: []
};

class Roundabout {
	constructor(settings) {
		// User defined (commented out = not used yet)

		this.pages = settings.pages ? settings.pages : {};
		this.id = settings.id ? settings.id : ".myCarousel";
      this.type = settings.type ? settings.type : "normal";
      this.infinite = settings.infinite === false ? settings.infinite : true;
		this.parent = settings.parent ? settings.parent : "body";
		this.autoGenCSS = settings.autoGenCSS === false ? settings.autoGenCSS : true;
      this.navigation = settings.navigation === false ? settings.navigation : true;
      this.navigation_behavior = (settings.navigation_behavior && this.infinite) ? settings.navigation_behavior : "direction";
		this.autoScroll = settings.autoScroll ? settings.autoScroll : false;
		this.autoScroll_speed = settings.autoScroll_speed >= 0 ? settings.autoScroll_speed : 5000;
		this.autoScroll_timeout = settings.autoScroll_timeout >= 0 ? settings.autoScroll_timeout : 15000;
		this.autoScroll_pauseOnHover = settings.autoScroll_pauseOnHover ? settings.autoScroll_pauseOnHover : false;
		this.autoScroll_startAfter = settings.autoScroll_startAfter >= 0 ? settings.autoScroll_startAfter : 5000;
		this.autoScroll_direction = settings.autoScroll_direction ? settings.autoScroll_direction : "right";
		this.transition = settings.transition >= 0 ? settings.transition : 300;
		this.transition_timingFunction = settings.transition_timingFunction ? settings.transition_timingFunction : "ease";
		this.throttle = settings.throttle === false ? settings.throttle : true;
		this.throttle_timeout = settings.throttle_timeout >= 0 ? settings.throttle_timeout : 300;
		this.throttle_matchTransition = settings.throttle_matchTransition ? settings.throttle_matchTransition : true;
		this.throttle_keys = settings.throttle_keys === false ? settings.throttle_keys : true;
		this.throttle_swipe = settings.throttle_swipe === false ? settings.throttle_swipe : true;
		this.throttle_buttons = settings.throttle_buttons === false ? settings.throttle_buttons : true;
      this.throttle_navigation = settings.throttle_navigation == false ? settings.throttle_navigation : true;
      
		this.keys = settings.keys === false ? settings.keys : true;
		this.swipe = settings.swipe === false ? settings.swipe : true;
		this.swipe_threshold = settings.swipe_threshold >= 0 ? settings.swipe_threshold : 300;
		this.swipe_multiplier = settings.swipe_multiplier ? settings.swipe_multiplier : 1;
		this.swipe_resistance = settings.swipe_resistance >= 0 ? settings.swipe_resistance : 0.95;

		this.pagesToShow = settings.pagesToShow ? settings.pagesToShow : 1;
		this.enlargeCenter = settings.enlargeCenter ? settings.enlargeCenter : 100;
		this.sizeFalloff = settings.sizeFalloff ? settings.sizeFalloff : 0;
		this.pageSpacing = settings.pageSpacing ? settings.pageSpacing : 0;
		this.pageSpacingUnits = settings.pageSpacingUnits ? settings.pageSpacingUnits : "px";
		this.spacingMode = settings.spacingMode ? settings.spacingMode : "fill";
      this.scrollBy = settings.scrollBy ? settings.scrollBy : 1;
      this.showWrappedPage = settings.showWrappedPage ? settings.showWrappedPage : false;

		// this.direction = (settings.direction) ? settings.direction : 0;

		// this.offsetIn = (settings.offsetIn) ? settings.offsetIn : 20;
		// this.offsetOut = (settings.offsetOut) ? settings.offsetOut : -20;
		// this.offsetUnits = (settings.offsetUnits) ? settings.offsetUnits : "px";

		this.mobile = settings.mobile ? settings.mobile : {swipe_threshold: 50};
		this.mobile_breakpoint = settings.mobile_breakpoint ? settings.mobile_breakpoint : 700;
		this.visualPreset = settings.visualPreset ? settings.visualPreset : 0;

		// this.val = settings.val ? settings.val : default;
		// this.val = (settings.val === false) ? settings.val : true;
		// this.val = settings.val ? settings.val : false;

		// Private

		// general
		this.orderedPages = [];
		this.positions = [];
		this.orderedPagesMainIndex = 0;
		this.scrollIsAllowed = true;
		this.onPage = 0;
		// this.leftSidePages = 0;
		this.uniqueId = roundabout.on + 1;
		// internal
		this.allowInternalStyles = true;
		this.allowInternalHTML = true;
		// swipe
		this.sx = 0;
		this.sy = 0;
		this.ex = 0;
		this.ey = 0;
		this.dx = 0;
		this.x = 0;
		this.y = 0;
		this.lastMove = null;
		this.t = false;
		this.dragging = false;
		this.canSnap = false;
		this.swipeFrom = 0;
		this.swipeIsAllowed = true;
		// autoscroll
		this.scrollTimeoutHolder = null;
		this.scrollIntervalHolder = null;
		// bound functions
		this.boundFollow = null;
		this.boundEnd = null;
		this.boundCancel = null;

		// Function calls
		this.initialActions();
		this.replaceWithMobile();
		this.setListeners();
		this.debug_output();
	}

	/*
   ==================================================================================================================
   
   SCROLLING
   ==================================================================================================================
   */

	/*
   Ideal flow:
   1. Check if scrolling is possible. If not, adjust as necessary to do as much as possible.
   2. Adjust positions.
   3a. If not values only, give correct classes to corresponding elements.
   3b. If values only, skip class assignments
   4. Animate if necessary
   flusher:
   const flushCssBuffer = document.querySelector(`.roundabout-${this.uniqueId}-page-${a}`).offsetWidth;
   transition changes:
   - change transition
   - make style change
   - flush buffer
   - undo transition change   
   */

   // Scrolls to the next page. Does not handle clicks/taps
	scrollNext(distance, valuesOnly = false) {
		if (this.onPage >= this.pages.length - this.pagesToShow && !this.infinite && this.type == "normal") {
			return;
		} else if (distance > this.pages.length - this.pagesToShow - this.onPage && !this.infinite) {
			let remainingDistance = this.pages.length - this.pagesToShow - this.onPage;
			this.scrollNext(remainingDistance, valuesOnly);
		} else {
			let wrapper = document.querySelector(`.roundabout-${this.uniqueId}-page-wrap`);

			// position all pages to correct place before move and remove hidden pages
			for (let a = 0; a < this.positions.length; a++) {
				let beforeMove = this.calcPagePos(a);
				if (beforeMove != "0px") {
					document.querySelector(`.roundabout-${this.uniqueId}-page-${this.orderedPages[a]}`).classList.remove("roundabout-hidden-page");
				}
				document.querySelector(`.roundabout-${this.uniqueId}-page-${this.orderedPages[a]}`).style.left = beforeMove;
			}

			// transition wrapper
			if (!valuesOnly) {
				wrapper.style.left = this.calcPagePos(distance * -1);
			}

			// adjust values
			for (let a = 0; a < distance; a++) {
				this.positions.unshift(this.positions.pop());
				this.orderedPages.push(this.orderedPages.shift());
         }

         this.onPage += distance;

         if (this.onPage >= this.pages.length) {
            this.onPage -= this.pages.length;
         }
         
         if (this.navigation) {
            document.querySelector(`.roundabout-${this.uniqueId}-active-nav-btn`).classList.remove(`roundabout-${this.uniqueId}-active-nav-btn`);
            document.querySelector(`.roundabout-${this.uniqueId}-nav-btn-${this.onPage}`).classList.add(`roundabout-${this.uniqueId}-active-nav-btn`);
         }

			// finished positioning
			if (!valuesOnly) {
				setTimeout(() => {
					this.positionWrap(!valuesOnly);
					this.positionPages();
				}, this.transition);
			} else {
				this.positionWrap(!valuesOnly);
				this.positionPages();
         }
         
         if (this.navigation) {
            document.querySelector(`.roundabout-${this.uniqueId}-active-nav-btn`).classList.remove(`roundabout-${this.uniqueId}-active-nav-btn`);
            document.querySelector(`.roundabout-${this.uniqueId}-nav-btn-${this.onPage}`).classList.add(`roundabout-${this.uniqueId}-active-nav-btn`);
         }
		}
   }
   
	// Scrolls to the previous page. Does not handle clicks/taps
   scrollPrevious(distance, valuesOnly = false) {
		if (this.onPage <= 0 && !this.infinite && this.type == "normal") {
			return;
		} else if (Math.abs(distance) > this.onPage && !this.infinite) {
			let remainingDistance = -1 * this.onPage;
			this.scrollPrevious(remainingDistance, valuesOnly);
      } else {
			let wrapper = document.querySelector(`.roundabout-${this.uniqueId}-page-wrap`);

         // set up a position modifier array to mutate the normal right-based positioning
         let pos = [];
         for (let a = 0; a < this.positions.length; a++) {
            pos.push(a - Math.abs(distance));
         }
         for (let a = 0; a < Math.abs(distance); a++) {
            pos.push(pos.shift());
         }
         // console.log(pos);
			// position all pages to correct place before move and remove hidden pages
         for (let a = 0; a < this.positions.length; a++) {
				let beforeMove = this.calcPagePos(pos[a]);
				if (beforeMove != "0px") {
					document.querySelector(`.roundabout-${this.uniqueId}-page-${this.orderedPages[a]}`).classList.remove("roundabout-hidden-page");
				}
            document.querySelector(`.roundabout-${this.uniqueId}-page-${this.orderedPages[a]}`).style.left = beforeMove;
            // console.log(`beforeMove for page ${this.orderedPages[a]} is ${beforeMove}. Derived from ${pos[a]}`);
         }

			// transition wrapper
			if (!valuesOnly) {
				wrapper.style.left = this.calcPagePos(distance * -1);
			}

			// adjust values
         for (let a = 0; a < Math.abs(distance); a++) {
            this.positions.push(this.positions.shift());
            this.orderedPages.unshift(this.orderedPages.pop());
         }

         this.onPage += distance;

         if (this.onPage < 0) {
            this.onPage += this.pages.length;
         }

			// finished positioning
			if (!valuesOnly) {
				setTimeout(() => {
					this.positionWrap(!valuesOnly);
					this.positionPages();
				}, this.transition);
			} else {
				this.positionWrap(!valuesOnly);
				this.positionPages();
         }
         
         if (this.navigation) {
            document.querySelector(`.roundabout-${this.uniqueId}-active-nav-btn`).classList.remove(`roundabout-${this.uniqueId}-active-nav-btn`);
            document.querySelector(`.roundabout-${this.uniqueId}-nav-btn-${this.onPage}`).classList.add(`roundabout-${this.uniqueId}-active-nav-btn`);
         }
		}
   }

   scrollTo(page) {
      if (!this.infinite || this.navigation_behavior == "direction") {
         if (page < this.onPage) {
            if (this.throttle_navigation) {
               this.previousHandler(this, "scrollto", page - this.onPage);
            } else {
               this.scrollPrevious(page - this.onPage);
            }            
         } else {
            if (this.throttle_navigation) {
               this.nextHandler(this, "scrollto", page - this.onPage);
            } else {
               this.scrollNext(page - this.onPage);
            }
         }
      } else {
         if (this.findOffset(this.onPage, page, "p") < this.findOffset(this.onPage, page, "n")) {
            if (this.throttle_navigation) {
               this.previousHandler(this, "scrollto", -1*this.findOffset(this.onPage, page, "p"));
            } else {
               this.scrollPrevious(-1*this.findOffset(this.onPage, page, "p"));
            }
         } else {
            if (this.throttle_navigation) {
               this.nextHandler(this, "scrollto", this.findOffset(this.onPage, page, "n"));
            } else {
               this.scrollNext(this.findOffset(this.onPage, page, "n"));
            }            
         }
      }
   }

   nextHandler(parent, from, distance) {
      let sd;
      if (from == "snap") {
         sd = 1;
      } else if (from == "scrollto") {
         sd = distance;
      } else {
         sd = parent.scrollBy;
      }
		let sb = from == "snap" ? false : true;
		parent.resetScrollTimeout();
		if (parent.scrollIsAllowed && !parent.dragging) {
			parent.scrollNext(sd, false, sb);
			if ((parent.throttle && parent.throttle_buttons && from != "key") || (parent.throttle && parent.throttle_keys && from == "key")) {
				parent.scrollIsAllowed = false;
				setTimeout(() => {
					parent.scrollIsAllowed = true;
				}, parent.throttle_timeout);
			}
		}
	}

	previousHandler(parent, from, distance) {
      let sd;
      if (from == "snap") {
         sd = -1;
      } else if (from == "scrollto") {
         sd = distance;
      } else {
         sd = -parent.scrollBy;
      }
		let sb = from == "snap" ? false : true;
		parent.resetScrollTimeout();
		if (parent.scrollIsAllowed && !parent.dragging) {
			parent.scrollPrevious(sd, false, sb);
			if ((parent.throttle && parent.throttle_buttons && from != "key") || (parent.throttle && parent.throttle_keys && from == "key")) {
				parent.scrollIsAllowed = false;
				setTimeout(() => {
					parent.scrollIsAllowed = true;
				}, parent.throttle_timeout);
			}
		}
	}

	/*
   ==================================================================================================================
   
   AUTOSCROLL
   ==================================================================================================================
   */

	// On user interaction, this is called to pause scrolling until user is presumably done
	resetScrollTimeout() {
		clearTimeout(this.scrollTimeoutHolder);
		clearInterval(this.scrollIntervalHolder);
		this.scrollTimeoutHolder = setTimeout(() => {
			this.setAutoScroll(this);
		}, this.autoScroll_timeout);
	}

	// Initializes autoscroll if enabled
	setAutoScroll(parent, firstTime = false) {
		if (firstTime && parent.autoScroll) {
			setTimeout(() => {
				parent.scrollAuto(parent);
				parent.scrollIntervalHolder = setInterval(() => {
					parent.scrollAuto(parent);
				}, parent.autoScroll_speed);
			}, parent.autoScroll_startAfter);
		} else if (parent.autoScroll) {
			parent.scrollIntervalHolder = setInterval(() => {
				parent.scrollAuto(parent);
			}, parent.autoScroll_speed);
		}
	}

	// Called at each interval, determines how to scroll
	scrollAuto(parent) {
		if (parent.autoScroll_direction.toLowerCase() == "left" && parent.scrollIsAllowed) {
			parent.scrollPrevious(this.scrollBy);
		} else if (parent.autoScroll_direction.toLowerCase() == "right" && parent.scrollIsAllowed) {
			parent.scrollNext(this.scrollBy);
		}
	}

	/*
   ==================================================================================================================
   SWIPING
   ==================================================================================================================
   */

	// starts the touch if the user has a touchscreen
	setTouch(event, parent) {
		event.preventDefault();
		parent.t = true;
		parent.tStart(event, parent);
	}

	// called once when touch or click starts
	tStart(event, parent) {
		// throttling
		parent.resetScrollTimeout();
		if (parent.throttle_swipe) {
			if (parent.swipeIsAllowed) {
				if (parent.throttle) {
					parent.swipeIsAllowed = false;
				}
			} else {
				return;
			}
		}

		event.preventDefault();
		parent.dragging = true;
		parent.swipeFrom = parent.orderedPages[parent.orderedPagesMainIndex];

		// remove transitions to prevent elastic-y movement
		document.querySelector(`.roundabout-${parent.uniqueId}-page-wrap`).classList.remove(`roundabout-${this.uniqueId}-has-transition`);
		document.querySelector(`.roundabout-${parent.uniqueId}-page-wrap`).classList.add("roundabout-has-no-transition");

		// log the first touch position
		parent.lastMove = event.touches;
		if (parent.t) {
			parent.x = event.touches[0].clientX;
			parent.y = event.touches[0].clientY;
			parent.sx = event.touches[0].clientX;
			parent.sy = event.touches[0].clientY;
		} else {
			parent.x = event.clientX;
			parent.y = event.clientY;

			parent.sx = event.clientX;
			parent.sy = event.clientY;
		}

		document.addEventListener("mousemove", parent.boundFollow, false);
		document.addEventListener("mouseup", parent.boundEnd, false);

		if (parent.t) {
			document.addEventListener("touchmove", parent.boundFollow, false);
			document.addEventListener("touchend", parent.boundEnd, false);
			document.addEventListener("touchcancel", parent.boundCancel, false);
		}
	}

	// called repeatedly while dragging
	follow(event, parent) {
		if (parent.dragging) {
			// capture movements
			if (parent.t) {
				parent.x = event.changedTouches[0].clientX;
				parent.y = event.changedTouches[0].clientY;
			} else {
				parent.x = event.clientX;
				parent.y = event.clientY;
			}

			parent.dx = (parent.x - parent.sx) * parent.swipe_multiplier;

			// resistant scrolling
			if (Math.abs(parent.dx) < document.querySelector(parent.parent).offsetWidth && parent.infinite) {
				parent.dx = (parent.x - parent.sx) * parent.swipe_multiplier;
			} else if (parent.dx < 0) {
				if (parent.infinite) {
					parent.dx -= (parent.dx + document.querySelector(parent.parent).offsetWidth) * parent.swipe_resistance;
				} else if (parent.pages.length - parent.pagesToShow == parent.onPage) {
					if (parent.swipe_resistance == 1) {
						parent.dx = 0;
					} else {
						parent.dx -= parent.dx * parent.swipe_resistance;
					}
				}
			} else if (parent.dx > 0) {
				if (parent.infinite) {
					parent.dx -= (parent.dx - document.querySelector(parent.parent).offsetWidth) * parent.swipe_resistance;
				} else if (parent.orderedPages[parent.orderedPagesMainIndex] === 0) {
					if (parent.swipe_resistance == 1) {
						parent.dx = 0;
					} else {
						parent.dx -= parent.dx * parent.swipe_resistance;
					}
				}
			}

			// get distance values
			let dist = Math.abs(parent.dx);

			if (
				(dist >= parent.swipe_threshold && parent.infinite) ||
				(dist >= parent.swipe_threshold &&
					!parent.infinite &&
					parent.onPage >= 0 &&
					parent.onPage < parent.pages.length - parent.pagesToShow)
			) {
            parent.canSnap = true;
			} else {
				parent.canSnap = false;
			}

			let totalSize =
				document.querySelector(`.roundabout-${parent.uniqueId}-page-` + parent.orderedPages[parent.orderedPagesMainIndex]).offsetWidth +
				parent.pageSpacing;

         if (
            (dist >= totalSize && parent.infinite) ||
            (dist >= totalSize && !parent.infinite && parent.onPage <= parent.pages.length - parent.pagesToShow && parent.onPage >= 0)) {
				if (parent.dx > 0) {
               parent.scrollPrevious(-1, true);
				} else if (parent.dx < 0) {
					parent.scrollNext(1, true);
				}
				parent.sx = parent.x / 1;
				parent.dx = 0;
			} else {
				document.querySelector(`.roundabout-${parent.uniqueId}-page-wrap`).style.left = parent.dx + "px";
			}
		}
	}

	// called once when the touch or click ends
	tEnd(event, parent) {
		setTimeout(() => {
			parent.swipeIsAllowed = true;
		}, parent.throttle_timeout);

		document.querySelector(`.roundabout-${parent.uniqueId}-page-wrap`).classList.add(`roundabout-${this.uniqueId}-has-transition`);
		document.querySelector(`.roundabout-${parent.uniqueId}-page-wrap`).classList.remove(`roundabout-has-no-transition`);

		parent.dragging = false;

		// log the end of touch position
		if (parent.t) {
			parent.ex = event.changedTouches[0].clientX;
			parent.ey = event.changedTouches[0].clientY;
		} else {
			parent.ex = event.clientX;
			parent.ey = event.clientY;
		}

		// snap the page to the correct position, and reset for next swipe
		parent.snap(parent.canSnap, parent.dx, parent);
		parent.resetSwipeVars(parent);

		document.removeEventListener("mousemove", parent.boundFollow, false);
		document.removeEventListener("mouseup", parent.boundEnd, false);

		document.removeEventListener("touchmove", parent.boundFollow, false);
		document.removeEventListener("touchend", parent.boundEnd, false);
		document.removeEventListener("touchcancel", parent.boundCancel, false);
	}

	// handle touch cancel
	tCancel(event, parent) {
		event.preventDefault();
		document.removeEventListener(
			"mouseup",
			(event) => {
				parent.tEnd(event, parent);
			},
			false
		);
		document.removeEventListener(
			"touchend",
			(event) => {
				parent.tEnd(event, parent);
			},
			false
		);
		document.removeEventListener(
			"touchcancel",
			(event) => {
				parent.tCancel(event, parent);
			},
			false
		);
	}

	// snap to a new slide once touch or drag ends
   snap(al, dir, parent) {
		if (al) {
			if (dir > 0) {
				parent.previousHandler(parent, "snap");
				parent.positionWrap(false, 1); //? probably
			} else if (dir < 0) {
				parent.nextHandler(parent, "snap");
				parent.positionWrap(false, -1);
			}
		} else {
			parent.positionWrap(false, 0);
		}

		// parent.positionPages();
	}

	// reset all variables to defaults to avoid strange movements when a new touch starts
	resetSwipeVars(parent) {
		parent.sx = 0;
		parent.sy = 0;
		parent.ex = 0;
		parent.ey = 0;
		parent.x = 0;
		parent.y = 0;
		parent.dx = 0;
		parent.lastMove = [];
		parent.t = false;
		parent.canSnap = false;
	}

	// These remain bound to the constructor object, assisting in circumventing 'this' scope issues
	execMM(event) {
		this.follow(event, this);
	}
	execMU(event) {
		this.tEnd(event, this);
	}
	execTC(event) {
		this.tCancel(event, this);
	}

	/*
   ==================================================================================================================
   
   DEFAULT FUNCTIONS
   ==================================================================================================================
   */

	// Generates the default HTML structure
	defaultHTML() {
		let newCarousel = document.createElement("DIV");
		let html = `<div class="roundabout-${this.uniqueId}-swipe-overlay roundabout-swipe-overlay"></div>
                  <div class="roundabout-${this.uniqueId}-page-wrap roundabout-page-wrap roundabout-${this.uniqueId}-has-transition"></div>
                  <div class="roundabout-${this.uniqueId}-nav roundabout-nav">
                     <div class="roundabout-${this.uniqueId}-btn-r roundabout-btn-r roundabout-scroll-btn">
                        <svg viewBox="0 0 24 24">
                           <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                     </div>
                     <div class="roundabout-${this.uniqueId}-btn-l roundabout-btn-l roundabout-scroll-btn">
                        <svg viewBox="0 0 24 24">
                           <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                        </svg>
                     </div>
                  </div>`;
		newCarousel.innerHTML = html;
		newCarousel.classList.add("roundabout-wrapper");
		if (this.id.split("")[0] == "#") {
			let newId = this.id.split("");
			newId.shift();
			newId = newId.join("");
			newCarousel.setAttribute("id", newId);
		} else {
			let newClass = this.id.split("");
			newClass.shift();
			newClass = newClass.join("");
			newCarousel.classList.add(newClass);
		}
		document.querySelector(this.parent).appendChild(newCarousel);
	}

	// Generates the default CSS styling
	defaultCSS() {
		let css;
		let requiredCss = `.roundabout-page{position:absolute}.roundabout-page-wrap{width:100%;height:100%;position:absolute;left:0}.roundabout-wrapper{position:relative}`;
		switch (this.visualPreset) {
         case 0:
            css = `.roundabout-wrapper{height:80vh;margin-top:30px;overflow:hidden}.roundabout-scroll-btn svg{position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;height:70px}.roundabout-nav-wrap{position:absolute;left:0;right:0;margin:auto;display:flex;justify-content:space-evenly;bottom:0;height:40px;width:25%}.roundabout-scroll-btn{position:absolute;top:0;bottom:0;margin:auto;height:80px;width:80px;cursor:pointer;color:#fff}.roundabout-nav{height:100%;width:100%}.roundabout-btn-l{left:0}.roundabout-btn-r{right:0}.roundabout-swipe-overlay{width:calc(100% - 140px);height:calc(100% - 40px);top:0;left:0;right:0;position:absolute;margin:auto;z-index:2}.roundabout-${this.uniqueId}-nav-btn{margin:auto;height:10px;width:10px;border-radius:100%;border:2px solid #fff;transition:.2s;cursor:pointer}.roundabout-${this.uniqueId}-inactive-nav-btn{background:0 0}.roundabout-${this.uniqueId}-active-nav-btn{background:#fff}`;
				break;
		}
		let newStyle = document.createElement("STYLE");
		newStyle.setAttribute("type", "text/css");
		newStyle.innerHTML = css;
		document.getElementsByTagName("head")[0].appendChild(newStyle);

		let newReqStyle = document.createElement("STYLE");
		newReqStyle.setAttribute("type", "text/css");
		newReqStyle.innerHTML = requiredCss;
		document.getElementsByTagName("head")[0].appendChild(newReqStyle);
	}

	// Generates the required CSS. Seperate from default styling
	internalCSS() {
		let css = `.roundabout-${this.uniqueId}-has-transition {
         transition:${this.transition / 1000}s; 
         transition-timing-function:${this.transition_timingFunction}} 
         .roundabout-has-no-transition{
            transition:none;} 
         .roundabout-hidden-page {
            visibility: hidden}
         .carousel-error-message {
            position:relative;
            margin:auto;
            left:0;
            right:0;
            top:0;
            bottom:0;
            border-radius:5px;
            border:3px solid black;
            background: white;
            text-align:center;
            font-family:sans-serif;
            width:30%;}`;
		let newStyle = document.createElement("STYLE");
		newStyle.setAttribute("type", "text/css");
		newStyle.innerHTML = css;
		document.getElementsByTagName("head")[0].appendChild(newStyle);
	}

	/*
   ==================================================================================================================
   GENERAL FUNCTIONS
   
   ==================================================================================================================
   */

	// Create each new page from the pages array and append to the parent element
	generatePages() {
		let baseHeight = 100;
		for (let a = 0; a < this.pages.length; a++) {
			let newPage = document.createElement("DIV");
			newPage.classList.add(`roundabout-${this.uniqueId}-page-${a}`, "roundabout-page");
			let newPos;
			if (this.type == "normal") {
				// Set width and positions based on mode: calculated to accomodate spacing and number of pages
				let iteratorMod, iteratorMod2;
				if (this.spacingMode == "evenly") {
					iteratorMod = 1;
					iteratorMod2 = 0;
				} else {
					iteratorMod = -1;
					iteratorMod2 = -1;
				}

				let pageWidth =
					"calc((100% - " + (this.pagesToShow + iteratorMod) * this.pageSpacing + this.pageSpacingUnits + ") / " + this.pagesToShow + ")";
				newPage.style.width = pageWidth;
				if (a <= this.pagesToShow + 2) {
					newPos =
						"calc((((100% - " +
						(this.pagesToShow + iteratorMod) * this.pageSpacing +
						this.pageSpacingUnits +
						") / " +
						this.pagesToShow +
						") * " +
						(a - 1) +
						") + " +
						(this.pageSpacing * (a + iteratorMod2) + this.pageSpacingUnits) +
						")";
				}
			} else {
				newPage.style.width = "100%";
			}
         newPage.style.height = "100%";
			// Give a background image (if supplied)
			if (this.pages[a].background_image) {
				newPage.style.background = "url(" + this.pages[a].background_image + ")";
				//! make changeable
				newPage.style.backgroundSize = "cover";
				newPage.style.backgroundPosition = "center center";
			}
			document.querySelector(`.roundabout-${this.uniqueId}-page-wrap`).appendChild(newPage);
			this.orderedPages.push(a);

			if (a <= this.pagesToShow + 1) {
				this.positions.push(newPos);
			} else {
				this.positions.push("0px");
			}
      }
      
      // create navigation

      if (this.navigation) {
         let navbar = document.createElement("div");
         navbar.classList.add(`roundabout-${this.uniqueId}-nav-wrap`, "roundabout-nav-wrap");
         document.querySelector(`.roundabout-${this.uniqueId}-nav`).appendChild(navbar);

         let numButtons;
         if (this.type == "normal") {
            if (this.infinite) {
               numButtons = this.pages.length;
            } else {
               numButtons = this.pages.length - (this.pagesToShow - 1);
            }
         }
         for (let a = 0; a < numButtons; a++) {
            let newNavBtn = document.createElement("div");
            if (a == 0) {
               newNavBtn.classList.add(`roundabout-${this.uniqueId}-active-nav-btn`);
            } else {
               newNavBtn.classList.add(`roundabout-${this.uniqueId}-inactive-nav-btn`);
            }
            newNavBtn.classList.add(`roundabout-${this.uniqueId}-nav-btn`, `roundabout-${this.uniqueId}-nav-btn-${a}`);
            navbar.appendChild(newNavBtn);
            newNavBtn.addEventListener("click", () => {
               this.scrollTo(a);
            });
         }
      }

		this.positions.push(this.positions.shift());

		this.positionPages();
	}

	// If mobile replacement values are provided, the defaults are overridden when the screen is assumed to be that of a mobile
	replaceWithMobile() {
		let mobileL = 0;
		for (let key in this.mobile) {
			if (this.mobile.hasOwnProperty(key)) {
				mobileL++;
			}
		}
		let settingsL = 0;
		for (let key in this) {
			if (this.hasOwnProperty(key)) {
				settingsL++;
			}
		}
		if (screen.width <= this.mobile_breakpoint) {
			let c = Object.entries(this);
			let cm = Object.entries(this.mobile);
			for (let a = 0; a < mobileL; a++) {
				for (let b = 0; b < settingsL; b++) {
					if (c[b][0] == cm[a][0]) {
						this[c[b][0].toString()] = cm[a][1];
					}
				}
			}
		}
	}

	// Runs through applicable settings and takes actions based on them. Mostly to reduce constructor clutter
	initialActions() {
		if (this.allowInternalStyles) {
			this.internalCSS();
		}
		if (this.checkForErrors()) {
			roundabout.on++;
			if (this.allowInternalHTML) {
				this.defaultHTML();
			}
			if (this.autoGenCSS && this.allowInternalStyles) {
				this.defaultCSS();
			}
			if (this.throttle_matchTransition) {
				this.throttle_timeout = this.transition;
			}
			if (this.autoScroll) {
				this.setAutoScroll(this, true);
			}
			this.generatePages();
			this.boundFollow = this.execMM.bind(this);
			this.boundEnd = this.execMU.bind(this);
			this.boundCancel = this.execTC.bind(this);
			if (this.type == "normal") {
				this.swipe_threshold /= this.pagesToShow;
			}
		}
	}

	// Sets all required eventListeners for the carousel
	setListeners() {
		document.querySelector(`.roundabout-${this.uniqueId}-btn-r`).addEventListener("click", () => {
			this.nextHandler(this);
		});
		document.querySelector(`.roundabout-${this.uniqueId}-btn-l`).addEventListener("click", () => {
			this.previousHandler(this);
		});
		if (this.keys) {
			document.addEventListener("keydown", (event) => {
				switch (event.key) {
					case "ArrowLeft":
						this.previousHandler(this, "key");
						break;
					case "ArrowRight":
						this.nextHandler(this, "key");
						break;
				}
			});
		}
		if (this.autoScroll_pauseOnHover) {
			document.querySelector(this.parent).addEventListener("mouseover", () => {
				this.scrollIsAllowed = false;
			});
			document.querySelector(this.parent).addEventListener("mouseout", () => {
				this.scrollIsAllowed = true;
				this.resetScrollTimeout();
			});
		}
		if (this.swipe) {
			document.querySelector(`.roundabout-${this.uniqueId}-swipe-overlay`).addEventListener(
				"mousedown",
				(event) => {
					this.tStart(event, this);
				},
				false
			);
			document.querySelector(`.roundabout-${this.uniqueId}-swipe-overlay`).addEventListener(
				"touchstart",
				(event) => {
					this.setTouch(event, this);
				},
				false
			);
		}
	}

	// prevents breakage by providing constraints and displaying an error message
	checkForErrors() {
		if (this.pages.length - this.pagesToShow <= 1) {
			this.displayError(
				"For the number of pages supplied, there are too many being shown. There must be at least 2 fewer pages shown than the number of pages. Minimum required pages is 3."
			);
			return false;
		}
		if (this.id.split("")[0] !== "#" && this.id.split("")[0] !== ".") {
			this.displayError("An invalid selector prefix was given for the parent. Valid selector prefixes are '#' for IDs or '.' for classes.");
			return false;
		}
		if (roundabout.usedIds.includes(this.id)) {
			this.displayError(`The selector ${this.id} is already in use by another carousel. Please use a unique selector.`);
			return false;
		} else {
			roundabout.usedIds.push(this.id);
		}
		if (this.pagesToShow < this.scrollBy) {
			this.displayError("'scrollBy' must be less than or equal to 'pagesToShow'.");
			return false;
		}
		return true;
	}

	/*
   ==================================================================================================================
   UTILITY
   
   ==================================================================================================================
   */

	// after a transition, places each page where they should be for the next transiton
	positionPages() {
		for (let a = 0; a < this.positions.length; a++) {
			if (this.positions[a] == "0px") {
				document.querySelector(`.roundabout-${this.uniqueId}-page-${a}`).classList.add("roundabout-hidden-page");
				document.querySelector(`.roundabout-${this.uniqueId}-page-${a}`).style.left = this.positions[a];
			} else {
				document.querySelector(`.roundabout-${this.uniqueId}-page-${a}`).style.left = this.positions[a];
            document.querySelector(`.roundabout-${this.uniqueId}-page-${a}`).classList.remove("roundabout-hidden-page");
            
            if (!this.infinite && a == 0 && this.onPage > 1 && !this.showWrappedPage) {
               document.querySelector(`.roundabout-${this.uniqueId}-page-${a}`).classList.add("roundabout-hidden-page");
            }
            if (!this.infinite && a == this.positions.length - 1 && this.onPage == 0 && !this.showWrappedPage) {
               document.querySelector(`.roundabout-${this.uniqueId}-page-${this.positions.length - 1}`).classList.add("roundabout-hidden-page");
            }
			}
		}
	}

	// sets page wrap back to left: 0. true = instant movment, false = current transition
	positionWrap(setTransitions = true, position = 0) {
		let wrapper = document.querySelector(`.roundabout-${this.uniqueId}-page-wrap`);
		if (setTransitions) {
			wrapper.classList.remove(`roundabout-${this.uniqueId}-has-transition`);
			wrapper.classList.add(`roundabout-has-no-transition`);
		}
		wrapper.style.left = this.calcPagePos(position);
		const flushCssBuffer = wrapper.offsetWidth;
		if (setTransitions) {
			wrapper.classList.add(`roundabout-${this.uniqueId}-has-transition`);
			wrapper.classList.remove(`roundabout-has-no-transition`);
		}
   }
   
   findOffset(start, end, direction) {
      if (direction == "p") {
         if (end < start) {
            return start - end;
         } else {
            return start + this.pages.length - end;
         }
         
      } else if (direction == "n") {
         if (end < start) {
            return this.pages.length - start + end;
         } else {
            return end - start;
         }
      }
   }

	// returns the correct css positioning of a page given its position, 0 being the leftmost visible page
	calcPagePos(pagePos) {
		if (pagePos == 0) {
			return "0px";
		}
		pagePos += 1;
		let iteratorMod, iteratorMod2;
		if (this.spacingMode == "evenly") {
			iteratorMod = 1;
			iteratorMod2 = 0;
		} else {
			iteratorMod = -1;
			iteratorMod2 = -1;
		}

		let newPos =
			"calc((((100% - " +
			(this.pagesToShow + iteratorMod) * this.pageSpacing +
			this.pageSpacingUnits +
			") / " +
			this.pagesToShow +
			") * " +
			(pagePos - 1) +
			") + " +
			(this.pageSpacing * (pagePos + iteratorMod2) + this.pageSpacingUnits) +
			")";

		return newPos;
	}

	/*
   ==================================================================================================================
   OTHER
   
   ==================================================================================================================
   */

	// creates error message box
	displayError(message, title = "Error:") {
		let em = document.createElement("DIV");
		em.classList.add("carousel-error-message");
		let t = document.createElement("SPAN");
		t.innerHTML = title;
		t.style.color = "red";
		t.style.fontWeight = "bold";
		em.appendChild(t);
		let m = document.createElement("SPAN");
		m.innerHTML = message;
		let lb = document.createElement("BR");
		em.appendChild(lb);
		em.appendChild(m);
		document.querySelector(this.parent).appendChild(em);
		console.error(message);
	}

	debug_output() {
		// console.log(this.orderedPages);
		// console.log(this.positions);
	}
}

//? debug helper
// document.addEventListener("keydown", function (e) {
//    switch (e.key) {
//       case "a":
//          console.log(c1.swipeIsAllowed);
//          break;
//    }
// });