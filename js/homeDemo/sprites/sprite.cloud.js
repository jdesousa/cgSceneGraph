/**
 * Copyright (c) 2012  Capgemini Technology Services (hereinafter “Capgemini”)
 *
 * License/Terms of Use
 *
 * Permission is hereby granted, free of charge and for the term of intellectual property rights on the Software, to any
 * person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify
 * and propagate free of charge, anywhere in the world, all or part of the Software subject to the following mandatory conditions:
 *
 *   •    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *  Any failure to comply with the above shall automatically terminate the license and be construed as a breach of these
 *  Terms of Use causing significant harm to Capgemini.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 *  WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 *  OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  Except as contained in this notice, the name of Capgemini shall not be used in advertising or otherwise to promote
 *  the use or other dealings in this Software without prior written authorization from Capgemini.
 *
 *  These Terms of Use are subject to French law.
 *
 * @author Gwennael Buchet (gwennael.buchet@capgemini.com)
 * @date 07/07/2012
 *
 * Purpose:
 * Subclassing CGSGNode.
 *
 */
var CloudNode = CGSGNode.extend(
	{
		initialize : function(x, y, width, height) {
			//call the initialize of the parent
			this._super(x, y, width, height);

			//define the classType with the name of the class
			this.classType = "CloudNode";

			//define attributes of your custom node
			this.firstColor = "white";
			this.lastColor = "LightGray";

			//fake canvas to pre-render static display
			this.tmpCanvas = null;

			this.initShape();

			this.initPosAndSpeed();

			//random values for scaling animation
			this.scaleYSpeed = 16.0 + Math.random() * 2.0;
		},

		/**
		 * Pre-render the cloud into a temp canvas to optimize the perfs
		 */
		initShape : function() {
			this.tmpCanvas = document.createElement('canvas');
			this.tmpCanvas.width = 400;
			this.tmpCanvas.height = 300;
			var tmpContext = this.tmpCanvas.getContext('2d');

			var startX = 40;
			var startY = 100;

			tmpContext.save();
			tmpContext.scale(0.4, 0.4);

			// draw cloud shape
			tmpContext.beginPath();
			tmpContext.moveTo(startX, startY);
			tmpContext.bezierCurveTo(startX - 60 + Math.random() * 60, startY + 20, startX - 40, startY + 70,
			                         startX + 60, startY + 70);
			tmpContext.bezierCurveTo(startX + 60 + Math.random() * 100, startY + 60 + Math.random() * 80, startX + 250,
			                         startY + 40, startX + 220, startY + 20);
			tmpContext.bezierCurveTo(startX + 230 + Math.random() * 60, startY - 40, startX + 200, startY - 50,
			                         startX + 170, startY - 30);
			tmpContext.bezierCurveTo(startX + 120 + Math.random() * 60, startY - 75, startX + 80 + Math.random() * 60,
			                         startY - 60, startX + 80, startY - 30); //middle_top
			tmpContext.bezierCurveTo(startX + 30 + Math.random() * 40, startY - 75 + Math.random() * 40,
			                         startX - 20 + Math.random() * 40, startY - 60, startX, startY); //left-top
			tmpContext.closePath();

			var gradient = tmpContext.createLinearGradient(startX, startY, startX, this.dimension.height + startY);
			gradient.addColorStop(0, this.firstColor);
			gradient.addColorStop(1, this.lastColor);
			tmpContext.fillStyle = gradient;
			tmpContext.fill();

			tmpContext.restore();
		},

		start : function() {
			this.translateTo(Math.random() * canvasWidth, 2 + Math.random() * 20);
			sceneGraph.animate(this, "position.x", this.speed, this.position.x, canvasWidth + Math.random() * 50,
			                   "linear", 0, true);

			var bindInitPosAndSpeed = this.initPosAndSpeed.bind(this);
			sceneGraph.getTimeline(this, "position.x").onAnimationEnd = bindInitPosAndSpeed;
		},

		initPosAndSpeed : function() {
			this.globalAlpha = 0.7 + Math.random() * 0.295;
			this.translateTo(CGSGMath.fixedPoint(-150 + Math.random() * 20), CGSGMath.fixedPoint(Math.random() * 50));
			this.currentPos = 0;
			this.speed = CGSGMath.fixedPoint(canvasWidth * 1.5 + Math.random() * 600);
			sceneGraph.animate(this, "position.x", this.speed, this.position.x,
			                   CGSGMath.fixedPoint(canvasWidth + Math.random() * 50), "linear", 2, true);
		},

		/**
		 * @override
		 * Must be defined to allow the scene graph to render the image nodes
		 * */
		render : function(context) {
			//save current state
			//always call it
			this.beforeRender(context);

			context.globalAlpha = this.globalAlpha;

			//custom rendering
			var heightScale = -1 * Math.sin(cgsgCurrentFrame / this.scaleYSpeed) * 0.01 + 0.99;
			context.scale(1.0, heightScale);
			//render the pre-rendered canvas
			context.drawImage(this.tmpCanvas, 0, 0);

			/*this.currentPos++;
			 if (this.currentPos >= this.speed) {
			 this.initPosAndSpeed();
			 }*/

			//restore state
			//always call it
			this.afterRender(context);
		},

		/**
		 *
		 * @return a copy of this node
		 */
		copy : function() {
			var node = new CloudNode(this.position.x, this.position.y, this.dimension.width,
			                         this.dimension.height);
			//call the super method
			node = this._super(node);

			//node.color = this.color;
			//node.lineColor = this.lineColor;
			//node.lineWidth = this.lineWidth;

			return node;
		}
	}
);