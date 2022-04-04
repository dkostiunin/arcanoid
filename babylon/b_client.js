import {buildCar, build_ground,buildSphera,buildBricks,BigBox,MinBox,winEffect,timeIsOver} from './meshs.js'
import {levels} from './levels.js'
import {BrickTestures,GoldTextures,IceTextures,SilverTextures} from './textures.js'

let scene,glob_scene,camera,sphere=[],box,ground,SpeedSphera=10,LinearVelocitySpere=new BABYLON.Vector3(0,0,0),moving=true,observers={},
diffPick=2,ScaleSpeedBox=25,boxPosY=.75,startTime='00:00',countTime=false,bestTime,DiffX,DiffY,
indexLevel,passedLevel=Number(localStorage.getItem('passedLevel')),selectedLevel=localStorage.getItem('selectedLevel')

const canvas = document.getElementById("renderCanvas"), engine = new BABYLON.Engine(canvas, true)

for(let i=levels.length-1;i>=0;i--){
	let opt=`<option value="${i}">${i}</option>`
	changeLevel.insertAdjacentHTML('afterbegin',opt)
}

const NumLevels = changeLevel.querySelectorAll('option')

if(selectedLevel||selectedLevel==0){indexLevel=selectedLevel}
else if(passedLevel){indexLevel=passedLevel}
else {indexLevel=0;localStorage.setItem('selectedLevel',0);localStorage.setItem('passedLevel',0);passedLevel=0;selectedLevel=0}

bestTime=Number(localStorage.getItem('bestTime'+indexLevel))	
if(bestTime){
	bestTime<0?BestTime.textContent='-'+new Date(Math.abs(bestTime)).toISOString().slice(-10, -5):BestTime.textContent=new Date(bestTime).toISOString().slice(-10, -5)
}

NumLevels.forEach((i,j)=>{if(j>passedLevel){i.disabled=true}})	
for(let i=localStorage.length-1; i>=0; i--) {
	if(localStorage.key(i).includes('Userlevel')){
		changeLevel.insertAdjacentHTML('beforeend',`<option value="U${localStorage.key(i).slice(9)}">U${localStorage.key(i).slice(9)}</option>`)
	}
}
	
changeLevel.insertAdjacentHTML('beforeend',`<option value="+">+</option>`)
changeLevel.value=selectedLevel

const createConstructor =  (CL) => {
	['TopElements','SS','buttonPauseGo'].forEach(i=>{document.getElementById(i).remove()})
	let bricks=[],Xmin=false,Xmax=false,Ymin=false,Ymax=false,Zmin=false,Zmax=false
	scene = new BABYLON.Scene(engine);
	scene.enablePhysics(new BABYLON.Vector3(0,0, 0))	
	camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI/2, 50, new BABYLON.Vector3(0, 15, 0))
	camera.wheelDeltaPercentage=0.005;		
	const light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 60, 0), new BABYLON.Vector3(0, -1, 0), Math.PI/2, 12);
	const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, -1, -1));
	ground=build_ground();ground.forEach(i=>{i.physicsImpostor._options.restitution=0})
	const TopB=`
		<div id="TopElements">
			<button id="AddBricks">Add Bricks</button>
			<button id="SaveLevel">Save</button>
			<button id="BonusesTime" onclick ="pageBT.style.display='flex'">Set Bonuses & Time</button>			
		</div>
	`	
	const BandT=`
		<div id="pageBT">
			 <button id="closeParent" onclick="pageBT.style.display='none'">❌</button>
			 <div>
				 <div style="padding: 1rem">
					 Frequency of Dropping Bonuses (%%)&nbsp
					 <input id="Frequency" style="width:80%;padding-top:1rem" type="range" value="50" max="100" oninput="num.value = this.value">
					 <output id="num">50</output>
				</div>
				<div style="padding: 1rem">Time to Complete the Level&nbsp&nbsp<input id="timerTime" type="time" value="00:01:00" step="1"></div>
			</div>
			<div id="BonusesParent"></div>
		</div>
	`	   
	renderCanvas.insertAdjacentHTML('afterend',TopB)
	renderCanvas.insertAdjacentHTML('afterend',BandT);
	
	['expand','squeeze','rocket','brakePedal','wings','glue','threeBalls','BallsDown','shield'].forEach((i,j)=>{		
		BonusesParent.insertAdjacentHTML('beforeend',
		`<div class="BonusesChild" style="background-image:url(/babylon/textures/${i}.svg)"><input type="checkbox" value=${j}></div>`)
	})
	
	SaveLevel.hidden = true
	SaveLevel.onclick = () => {
		let massiv=[[]]
		bricks.forEach((i,j)=>{
			i.name="brick"+j
			massiv[0].push([
				i.name,
				{
					width:(i.getBoundingInfo().boundingBox.extendSizeWorld.x*2).toFixed([2]),
					height:(i.getBoundingInfo().boundingBox.extendSizeWorld.y*2).toFixed([2]),
					depth:(i.getBoundingInfo().boundingBox.extendSizeWorld.z*2).toFixed([2])
				},
				[i.position.x.toFixed([2]),i.position.y.toFixed([2]),i.position.z.toFixed([2])],
				[i.material.bumpTexture.name,i.material.diffuseTexture.name]
			])			
		})
		massiv.push({time:Date.parse(`Thu, 01 Jan 1970 ${timerTime.value} GMT`),bonus:[],frequency:num.value/100})
		let inp=BonusesParent.querySelectorAll('input')
		inp.forEach(i=>{if(i.checked){massiv[1].bonus.push(i.value)}})
		let count=1
		if(CL){count=CL.slice(1);localStorage.removeItem('bestTime'+CL)}
		else{for(let i=localStorage.length-1; i>=0; i--){if(localStorage.key(i).includes('Userlevel')){count++}}}
		localStorage.setItem(`Userlevel${count}`,JSON.stringify(massiv))
		localStorage.setItem(`selectedLevel`,`U${count}`)
		localStorage.setItem(`Constructor`,0)
		window.location.reload()
	}
	
	const textures=['/babylon/textures/cuprumTexture.svg','/babylon/textures/GoldTexture.svg','/babylon/textures/SilverTexture.svg',
					'/babylon/textures/wall.jpg']
	const AddBrickButtons=`
		<div id="CenterElements">
			<button id="LeftBrick"><<</button>
			<button id="AddBrick">+</button>
			<button id="RightBrick">>></button>
		</div>
	`
	let SB
	AddBricks.onclick = function(){
		const C=document.getElementById('CenterElements'),Q=document.getElementById('ChangeBrickButt')
		if(Q){Q.remove()}
		let numTextur=0
		if(!C){
			renderCanvas.insertAdjacentHTML('afterend',AddBrickButtons)			
			AddBrick.onclick = () => {
				const B=scene.getMeshByName('br')
				const NewB = B.clone("brick"+bricks.length),
				NewM = new BABYLON.StandardMaterial("brick"+bricks.length);
				NewM.bumpTexture=new BABYLON.Texture('/babylon/textures/brick9.jpg')
				NewM.diffuseTexture=new BABYLON.Texture(textures[numTextur])
				NewB.material=NewM
				NewB.position=new BABYLON.Vector3(0,5,0)
				NewB.rotation = new BABYLON.Vector3(0, 0, 0);
				NewB.physicsImpostor = new BABYLON.PhysicsImpostor(NewB,BABYLON.PhysicsImpostor.BoxImpostor,{mass:1,restitution: 0,friction: 0})
				bricks.push(NewB)
				if(SaveLevel.hidden){SaveLevel.hidden = false}
			}
			const br = BABYLON.MeshBuilder.CreateBox("br", {width: 3,height: 1,depth: 3}),
			M = new BABYLON.StandardMaterial("Mbr"); 
			M.bumpTexture=new BABYLON.Texture('/babylon/textures/brick9.jpg')
			M.diffuseTexture=new BABYLON.Texture(textures[numTextur])
			br.position.z=-25;br.position.y=16
			br.material=M
			scene.registerBeforeRender(function() {br.rotation.x+=0.01;br.rotation.y+=0.01})
			RightBrick.onclick = () => {
				numTextur==textures.length-1?numTextur=0:numTextur+=1
				br.material.diffuseTexture=new BABYLON.Texture(textures[numTextur])
			}
			LeftBrick.onclick = () => {
				numTextur==0?numTextur=textures.length-1:numTextur-=1
				br.material.diffuseTexture=new BABYLON.Texture(textures[numTextur])
			}
		}
		else{C.remove();scene.getMeshByName('br').dispose();scene.onBeforeRenderObservable._observers.pop()}
	}	
	scene.onBeforeRenderObservable.add(() => {
		if(Xmin&&SB.position.x-SB.getBoundingInfo().boundingBox.extendSizeWorld.x-0.1>-10){SB.position.x-=0.1}
		if(Xmax&&SB.position.x+SB.getBoundingInfo().boundingBox.extendSizeWorld.x+0.1<10){SB.position.x+=0.1}
		if(Ymin&&SB.position.y-SB.getBoundingInfo().boundingBox.extendSizeWorld.y-0.1>0){SB.position.y-=0.1}
		if(Ymax&&SB.position.y+SB.getBoundingInfo().boundingBox.extendSizeWorld.y+0.1<30){SB.position.y+=0.1}
		if(Zmin&&SB.position.z-SB.getBoundingInfo().boundingBox.extendSizeWorld.z-0.1>-10){SB.position.z-=0.1}
		if(Zmax&&SB.position.z+SB.getBoundingInfo().boundingBox.extendSizeWorld.z+0.1<10){SB.position.z+=0.1}
	})
	scene.onPointerDown = function (e,res){
		let pickResult = scene.multiPick(scene.unTranslatedPointer.x, scene.unTranslatedPointer.y),
		bx=pickResult.filter(i=>(i.pickedMesh.name.includes('brick')))
		const ChangeBrickButtons=`
			<div id="ChangeBrickButt">
				<div><button class="B" id="axisXmin">-</button><span>X</span><button class="B" id="axisXmax">+</button></div>
				<div><button class="B" id="axisYmin">-</button><span>Y</span><button class="B" id="axisYmax">+</button></div>
				<div><button class="B" id="axisZmin">-</button><span>Z</span><button class="B" id="axisZmax">+</button></div>
				<div  id="DelBrick"><button id="DelBrickB">X</button></div>
				<div><button class="B" id="widthMin">-</button><span>W</span><button class="B" id="widthMax">+</button></div>
				<div><button class="B" id="heightMin">-</button><span>H</span><button class="B" id="heightMax">+</button></div>
				<div><button class="B" id="depthMin">-</button><span>D</span><button class="B" id="depthMax">+</button></div>
			</div>
		`
		if(bx[0]){
			let sss=bx[0].pickedMesh
			SB=bx[0].pickedMesh
			const C=document.getElementById('CenterElements')
			if(!document.getElementById('ChangeBrickButt')){renderCanvas.insertAdjacentHTML('afterend',ChangeBrickButtons)}
			axisXmin.ontouchstart =()=>{if(SB){Xmin=true}};axisXmin.ontouchend =()=>{Xmin=false}
			axisXmin.onmousedown =()=>{if(SB){Xmin=true}};axisXmin.onmouseup =()=>{Xmin=false}
			axisXmax.ontouchstart =()=>{if(SB){Xmax=true}};axisXmax.ontouchend =()=>{Xmax=false}
			axisXmax.onmousedown =()=>{if(SB){Xmax=true}};axisXmax.onmouseup =()=>{Xmax=false}
			
			axisYmin.ontouchstart =()=>{if(SB){Ymin=true}};axisYmin.ontouchend =()=>{Ymin=false}
			axisYmin.onmousedown =()=>{if(SB){Ymin=true}};axisYmin.onmouseup =()=>{Ymin=false}
			axisYmax.ontouchstart =()=>{if(SB){Ymax=true}};axisYmax.ontouchend =()=>{Ymax=false}
			axisYmax.onmousedown =()=>{if(SB){Ymax=true}};axisYmax.onmouseup =()=>{Ymax=false}
			
			axisZmin.ontouchstart =()=>{if(SB){Zmin=true}};axisZmin.ontouchend =()=>{Zmin=false}
			axisZmin.onmousedown =()=>{if(SB){Zmin=true}};axisZmin.onmouseup =()=>{Zmin=false}
			axisZmax.ontouchstart =()=>{if(SB){Zmax=true}};axisZmax.ontouchend =()=>{Zmax=false}
			axisZmax.onmousedown =()=>{if(SB){Zmax=true}};axisZmax.onmouseup =()=>{Zmax=false}
			DelBrick.onclick=()=>{if(SB){
				SB.dispose();bricks=bricks.filter(i=>(i!=SB))
				ChangeBrickButt.remove()
				if(bricks.length==0){SaveLevel.hidden = true}
			}}
			widthMin.onclick=()=>{if(SB){SB.scaling.x-=0.1}}
			widthMax.onclick=()=>{
				if(SB&&SB.position.x-SB.getBoundingInfo().boundingBox.extendSizeWorld.x>-10&&SB.position.x+SB.getBoundingInfo().boundingBox.extendSizeWorld.x<10){SB.scaling.x+=0.1}}
			heightMin.onclick=()=>{if(SB){SB.scaling.y-=0.1}}
			heightMax.onclick=()=>{
				if(SB&&SB.position.y-SB.getBoundingInfo().boundingBox.extendSizeWorld.y>0&&SB.position.y+SB.getBoundingInfo().boundingBox.extendSizeWorld.y<30){SB.scaling.y+=0.1}}
			depthMin.onclick=()=>{if(SB){SB.scaling.z-=0.1}}
			depthMax.onclick=()=>{
				if(SB&&SB.position.z-SB.getBoundingInfo().boundingBox.extendSizeWorld.z>-10&&SB.position.z+SB.getBoundingInfo().boundingBox.extendSizeWorld.z<10){SB.scaling.z+=0.1}}
				
			if(C){C.remove();scene.getMeshByName('br').dispose();scene.onBeforeRenderObservable._observers.pop()}
			if(SB.physicsImpostor._options.mass!=0){
				SB.physicsImpostor._options.mass=0
				SB.physicsImpostor.forceUpdate();SB.rotationQuaternion=new BABYLON.Quaternion()
			}
			SB.material.diffuseColor.r!=0?SB.material.diffuseColor=new BABYLON.Color3(0,0,0):(SB.material.diffuseColor=new BABYLON.Color3(1,1,1),SB=null)
			for(let i=bricks.length-1;i>=0;i--){
				if(bricks[i].material.diffuseColor.r==0&&bricks[i]!=SB){bricks[i].material.diffuseColor=new BABYLON.Color3(1, 1,1);break}
			}
		}
	}
	if(CL){
		localStorage.setItem('CL','')
		let LL=JSON.parse(localStorage.getItem('Userlevel'+CL.slice(1)))
		Frequency.value=LL[1].frequency*100
		num.value=LL[1].frequency*100
		timerTime.value=new Date(LL[1].time).toISOString().slice(-13, -5)
		let inp=BonusesParent.querySelectorAll('input')
		LL[1].bonus.forEach(i=>{inp[Number(i)]['checked']=true})
		const B=buildBricks(LL[0])
		scene.meshes.forEach(i=>{if(i.name.includes('brick')){bricks.push(i)}})
		SaveLevel.hidden = false
	}
	
	return scene;
}

const createScene =  () => {
	if(selectedLevel[0]=='U'){
		RightElements.insertAdjacentHTML('beforeend',`<button id="DelLevel">❌</button>`)
		RightElements.insertAdjacentHTML('beforeend',`<button id="EditLevel">📝</button>`)
		DelLevel.onclick = () => {
			const w=`
			<div id="ParentDelLevel"></div>
			<div id="ChildDelLevel">
				<div style="font-size: 1.5rem;">Delete Level?</div>
				<div style="width: 100%;display: flex;justify-content: space-evenly;">
				 <button id="DeleteYes" style="color:red">Yes</button>
				 <button style="color:green" onclick="ParentDelLevel.remove();ChildDelLevel.remove()">No</button>
				</div>
			</div>
			`
			renderCanvas.insertAdjacentHTML('afterend',w)
			DeleteYes.onclick = () => {
				const Lev=localStorage.getItem(`selectedLevel`)
				localStorage.removeItem('Userlevel'+Lev.slice(1))
				localStorage.removeItem('bestTime'+Lev)
				localStorage.setItem(`selectedLevel`,localStorage.getItem(`passedLevel`))
				window.location.reload()
			}			
		}
		EditLevel.onclick = () => {
			localStorage.setItem('CL',localStorage.getItem(`selectedLevel`))
			localStorage.setItem('Constructor',1)
			window.location.reload()
		}
	}
    scene = new BABYLON.Scene(engine);
	scene.enablePhysics(new BABYLON.Vector3(0,0, 0))	
	camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI/2, 50, new BABYLON.Vector3(0, 15, 0))
	camera.wheelDeltaPercentage=0.005;	
		
	const light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 60, 0), new BABYLON.Vector3(0, -1, 0), Math.PI/2, 12);
	//light.intensity = 2;//light.range = 100;
	const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, -1, -1));
		//hemiLight.intensity = 1
	let currentAnimation = null;
	
	const shadowGen = new BABYLON.ShadowGenerator(1024, light);
	//light.autoUpdateExtends = false;//shadowGen.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
	
	const BrickBall = new BABYLON.Sound('BrickBall', '/babylon/sounds/Brick_Ball.mp3', scene, null, {loop: false,autoplay: false}),
	LostBall = new BABYLON.Sound('LostBall', '/babylon/sounds/LostBall.mp3', scene, null, {loop: false,autoplay: false}),
	BrickGurgle = new BABYLON.Sound('BrickGurgle', '/babylon/sounds/bulk.mp3', scene, null, {loop: false,autoplay: false}),
	GetBonus = new BABYLON.Sound('GetBonus', '/babylon/sounds/GetBonus.mp3', scene, null, {loop: false,autoplay: false}),
	moveFloor = new BABYLON.Sound('moveFloor', '/babylon/sounds/moveFloor.mp3', scene, null, {loop: false,autoplay: false}),
	BulkBrick = new BABYLON.Sound('BulkBrick', '/babylon/sounds/BulkBrick.mp3', scene, null, {loop: false,autoplay: false})
	
	const water = new BABYLON.FireMaterial("lava")
	water.diffuseTexture = new BABYLON.Texture("/babylon/textures/waterbump.png");
	water.speed = 0.3;	
	const waterDown = BABYLON.MeshBuilder.CreateGround("waterDown", {width:20, height:20});	
	waterDown.material = water;
	
	sphere.push(buildSphera(scene,'sphere0',shadowGen))
	LinearVelocitySpere=sphere[0].physicsImpostor.getLinearVelocity();const LinearVelocitySpereZero=sphere[0].physicsImpostor.getLinearVelocity() 	
	let BricksMap	
	if(indexLevel[0]!='U'){BricksMap=levels[indexLevel]}
	else{BricksMap=JSON.parse(localStorage.getItem(`Userlevel${indexLevel.slice(1)}`))}		
	const bricks=buildBricks(BricksMap[0])
	
	box = buildCar();ground=build_ground()
	
	ground[0].physicsImpostor.onCollideEvent=(s,t)=>{
		let m=scene.getMeshByName(t.object.name)
		if(t.object.name.includes('sphere')){
			ChangeCountStopwath(m,30)
			LostBall.play()	
			if(sphere.length==1){
				if(currentAnimation){currentAnimation.stop()}
				moving=false;t.setMass (0)
				scene.meshes.forEach(i=>{
					if(i.name.includes('brick')&&i._physicsImpostor._options.mass!=0){
						scene.onBeforeRenderObservable.remove(observers[i.name])
						BricksMap[0]=BricksMap[0].filter(j=>(j[0]!=i.name))
						i.dispose();delete observers[i.name]
					}
				})
				if(BricksMap[0].length!=0){
					setTimeout(()=>{
						m.position= new BABYLON.Vector3(Math.random()*10-5, 15, Math.random()*10-5)
						m.physicsImpostor.forceUpdate();m.physicsImpostor.setMass (1);	moving=true
					},1000)
				}
				else{sphere[0].dispose()}
			}
			else if(sphere.length>1){m.dispose();sphere=sphere.filter(el=>el!=m)}
		}
		else if(t.object.name=='box'&&t._options.mass==99){BoxDefaultSize()}
	}

	const BT=BrickTestures(BricksMap[1].bonus),GT=GoldTextures(),IT=IceTextures(),ST=SilverTextures()
	bricks.forEach(i=>{
		i.physicsImpostor.onCollideEvent = function(brick,t) {
			if(['groundBack','groundFront','groundLeft','groundRight','groundTop'].includes(t.object.name)){BrickBall.play()}			
			let mesh=scene.getMeshByName(brick.object.name)
			
			if(t.object.name.includes('sphere')&&!observers[brick.object.name]){
				if(mesh){
					if(mesh.material.diffuseTexture&&mesh.material.diffuseTexture=='/babylon/textures/GoldTexture.svg'){
						setTimeout(()=>{mesh.material=GT[0]},100)
					}
					else if(mesh.material.diffuseTexture&&mesh.material.diffuseTexture=='fire'){
						setTimeout(()=>{mesh.material=GT[1]},100)
					}
					else if(mesh.material.diffuseTexture&&mesh.material.diffuseTexture=='/babylon/textures/SilverTexture.svg'){
						setTimeout(()=>{mesh.material=ST[0]},100)
					}
					else if(mesh.material.diffuseTexture&&mesh.material.diffuseTexture!='/babylon/textures/wall.jpg'){
						if(BricksMap[1].frequency>=Math.random()){mesh.material=BT[Math.floor(Math.random()*BT.length)]}
						shadowGen.addShadowCaster(mesh)
						brick.setMass (100)
						const observer = scene.onBeforeRenderObservable.add(function () {
							brick.applyForce(new BABYLON.Vector3(0,-20,0), mesh.getAbsolutePosition())	
						})
						observers[brick.object.name]=observer
					}
				}				
			}
			else if(t.object.name=='groundDown'){
				scene.onBeforeRenderObservable.remove(observers[brick.object.name])
				BrickGurgle.play()
				if(mesh){
					BricksMap[0]=BricksMap[0].filter(j=>(j[0]!=mesh.name))
					mesh.dispose();delete observers[brick.object.name]
				}
				if(BricksMap[0].length==0){
					sphere.forEach(i=>i.dispose())
					box.forEach(i=>i.dispose())
					countTime=false;winEffect(scene);
					let t=Date.now()-startTime
					setTimeout(()=>{nextLevel(NumLevels,t)},1500)
				}
			}
			else if(t.object.name=='box'&&t._options.mass!=100){
				let N
				if(mesh.material){N=mesh.material.diffuseTexture.name}
				if(N&&BricksMap[0].length!=1){
					scene.onBeforeRenderObservable.remove(observers[brick.object.name])
					let size=t.object.getBoundingInfo().boundingSphere.radius
					GetBonus.play();
					ScaleSpeedBox=25
					if((size<2||size>2.5)&&N!='/babylon/textures/expand.svg'&&N!='/babylon/textures/squeeze.svg'){
						BoxDefaultSize()
					}
					if(box[0].material.emissiveTexture!=null){box.forEach(i=>{i.material.emissiveTexture = null})}
					if(N=='/babylon/textures/expand.svg'){
						if(size<2.5){
							let x=box[0].position.x,z=box[0].position.z
							box[0].dispose();box = BigBox()
							diffPick=4;boxPosY=1;
							box[0].position.x=x;box[0].position.z=z
						}
					}
					else if(N=='/babylon/textures/squeeze.svg'){
						if(size>2){
							let x=box[0].position.x,z=box[0].position.z
							box[0].dispose();box = MinBox();diffPick=0.5;
							boxPosY=.5
							box[0].position.x=x;box[0].position.z=z					
						}					
					}
					else if(N=='/babylon/textures/rocket.svg'){ScaleSpeedBox=250}
					else if(N=='/babylon/textures/brakePedal.svg'){ScaleSpeedBox=5}
					else if(N=='/babylon/textures/wings.svg'){
						box[0].position.y=5
						box[0].physicsImpostor.setMass (99)
						box[0].physicsImpostor.applyImpulse(new BABYLON.Vector3(0,500,0), box[0].getAbsolutePosition())
					}
					else if(N=='/babylon/textures/glue.svg'){
						if(sphere.length>1){for(let i=sphere.length-1;i>0;i--){sphere[i].dispose();sphere.pop()}}
						const noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
						noiseTexture.animationSpeedFactor = 5
						box.forEach(i=>{i.material.emissiveTexture = noiseTexture;})
					}
					else if(N=='/babylon/textures/threeBalls.svg'){
						if(sphere.length==2){
							sphere.push(buildSphera(scene,'sphere2',shadowGen))
							sphere[2].position=new BABYLON.Vector3(box[0].position.x,1.75,box[0].position.z)
							sphere[2].physicsImpostor.applyImpulse(
								new BABYLON.Vector3(SpeedSphera*Math.random(),SpeedSphera*Math.random(),SpeedSphera*Math.random()), sphere[2].getAbsolutePosition()
							)
						}
						else if(sphere.length==1){
							sphere.push(buildSphera(scene,'sphere1',shadowGen))
							sphere[1].position=new BABYLON.Vector3(box[0].position.x,1.75,box[0].position.z)
							sphere[1].physicsImpostor.applyImpulse(
								new BABYLON.Vector3(SpeedSphera*Math.random(),SpeedSphera*Math.random(),SpeedSphera*Math.random()),sphere[1].getAbsolutePosition()
								)
							sphere.push(buildSphera(scene,'sphere2',shadowGen))
							sphere[2].position=new BABYLON.Vector3(box[0].position.x,1.75,box[0].position.z)
							sphere[2].physicsImpostor.applyImpulse(
								new BABYLON.Vector3(SpeedSphera*Math.random(),SpeedSphera*Math.random(),SpeedSphera*Math.random()),sphere[2].getAbsolutePosition()
							)
						}
					}
					else if(N=='/babylon/textures/BallsDown.svg'){	
						sphere.forEach(i=>{
							i.physicsImpostor.forceUpdate();
							i.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,-18,0), sphere[0].getAbsolutePosition())
						})
					}
					else if(N=='/babylon/textures/shield.svg'){
						if(!scene.getMeshByName('iceFloor1')){
							const iceFloor = BABYLON.MeshBuilder.CreateBox("iceFloor1", {width: 20,height: 1,depth: 20})
							iceFloor.receiveShadows=true
							iceFloor.material=IT[0]
							iceFloor.physicsImpostor = new BABYLON.PhysicsImpostor(iceFloor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1,friction: 0})
							iceFloor.physicsImpostor.onCollideEvent = function(floor,sp) {
							
								if(sp.object.name.includes('sphere')){
									if(iceFloor.material.diffuseTexture=='/babylon/textures/iceFloes1.jpg'){iceFloor.material=IT[1]}
									else if(iceFloor.material.diffuseTexture=='/babylon/textures/iceFloes2.jpg'){iceFloor.material=IT[2]}
									else if(iceFloor.material.diffuseTexture=='/babylon/textures/iceFloes3.jpg'){iceFloor.dispose()}
								}
							}
						}	
						
					}
				}
				if(mesh){
					ChangeCountStopwath(mesh,(countBonusTime(BricksMap[0].length)-5000)/1000)
					BricksMap[0]=BricksMap[0].filter(j=>(j[0]!=mesh.name))
					delete observers[brick.object.name];mesh.dispose()
				}
				if(BricksMap[0].length==0){
					sphere.forEach(i=>i.dispose())
					box.forEach(i=>i.dispose())
					countTime=false;
					winEffect(scene);let t=Date.now()-startTime+countBonusTime(1)-5000;					
					setTimeout(()=>{nextLevel(NumLevels,t)},1500)
				}
			} 
		}
	})
	
	function BoxDefaultSize(){
		let x=box[0].position.x,z=box[0].position.z
		box[0].dispose();box = buildCar();diffPick=2;boxPosY=.75;
		box[0].position.x=x;box[0].position.z=z
	}
	
	function ChangeCountStopwath(mesh,sec){
		const coord = BABYLON.Vector3.Project(mesh.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(),
		camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())),
		s=stopwatch.getBoundingClientRect(),idDiffTime=mesh.name+(coord.x+coord.y)
		let SecStr,SecNum=sec*1000,color
		sec<0?(SecStr='-'+sec,color='green'):(SecStr='+'+sec,color='red')
		DiffX=s.x-coord.x;DiffY=s.y-coord.y
		const DT=`<span id=${idDiffTime} style="position:absolute;color:${color};left:${coord.x}px;top:${coord.y}px;z-index:10">${SecStr}</span>`
		renderCanvas.insertAdjacentHTML('afterend',DT)
		const el=document.getElementById(idDiffTime)
		const anim = el.animate([{ transform:`translate(${DiffX}px,${DiffY}px)`}],1500)
		anim.onfinish = function endGame(){el.remove()}
		setTimeout(() =>{
			startTime-=SecNum			
			if(BricksMap[0].length==0&&countTime){
				let t=Date.now()-startTime
				if(t<=BricksMap[1].time){
					countTime=false;
					t<0?stopwatch.textContent='-'+new Date(Math.abs(t)).toISOString().slice(-10, -5):stopwatch.textContent=new Date(t).toISOString().slice(-10, -5)
					winEffect(scene);nextLevel(NumLevels,t)
				}
			}			
		},1500)
	}
	
	function countBonusTime(size){
		if(size>=60){return -1000}
		else if(size<60&&size>=25){return -3000}
		else {return (25+5-size)*-1000}
	}
	
	//scene.freezeActiveMeshes();//scene.autoClear = false; 
	scene.skipPointerMovePicking = true	
	scene.autoClearDepthAndStencil = false;
	scene.cleanCachedTextureBuffer();

	scene.onBeforeRenderObservable.add(() => {
		FPScount.textContent=engine.getFps().toFixed()
		if(countTime){
			let t=Date.now()-startTime
			t<0?stopwatch.textContent='-'+new Date(Math.abs(t)).toISOString().slice(-10, -5):stopwatch.textContent=new Date(t).toISOString().slice(-10, -5)
			if (t>BricksMap[1].time){countTime=false;timeIsOver(scene,moveFloor,BulkBrick)}
		}
		for(let i=sphere.length-1;i>=0;i--){
			 if(sphere[i].position.y>29.3){setSpeed(sphere[i],Number(changeSpeedSphera.value));sphere[i].position.y=29}		
			else if(sphere[i].position.y<0.7){setSpeed(sphere[i],Number(changeSpeedSphera.value));sphere[i].position.y=1}
			if(sphere[i].position.x>9.3){setSpeed(sphere[i],Number(changeSpeedSphera.value));sphere[i].position.x=9}
			else if(sphere[i].position.x<-9.3){setSpeed(sphere[i],Number(changeSpeedSphera.value));sphere[i].position.x=-9}
			if(sphere[i].position.z>9.3){setSpeed(sphere[i],Number(changeSpeedSphera.value));sphere[i].position.z=9}
			else if(sphere[i].position.z<-9.3){setSpeed(sphere[i],Number(changeSpeedSphera.value));sphere[i].position.z=-9}
		}
	})
	
	
	scene.onPointerDown = async function (e,res){
		if(moving){
			let pickResult = scene.multiPick(scene.unTranslatedPointer.x, scene.unTranslatedPointer.y);	
			let grnd=pickResult.filter(i=>(i.pickedMesh.name=='groundDown')),
			bx = pickResult.filter(i=>(['box','capsuleL','capsuleR','capsuleF','capsuleB'].includes(i.pickedMesh.name))),
			sp=pickResult.filter(i=>(i.pickedMesh.name.includes('sphere')))			
			if ((grnd[0]&&bx.length==0&&box[0].physicsImpostor.getLinearVelocity().y==0)||
				(grnd[0]&&box[0].physicsImpostor.getLinearVelocity().y!=0&&box[0].physicsImpostor._options.mass==99)) {	
				if(currentAnimation){currentAnimation.stop()}
				let pickedPosition = grnd[0].pickedPoint; 
				if(pickedPosition.x+diffPick<box[0].position.x){pickedPosition.x+=diffPick}
				else if(pickedPosition.x-diffPick>box[0].position.x){pickedPosition.x-=diffPick}
				if(pickedPosition.z+diffPick<box[0].position.z){pickedPosition.z+=diffPick}
				else if(pickedPosition.z-diffPick>box[0].position.z){pickedPosition.z-=diffPick}
				pickedPosition.y = boxPosY;
				let speedBox=100/(ScaleSpeedBox/BABYLON.Vector3.Distance(box[0].position,pickedPosition))
				currentAnimation = BABYLON.Animation.CreateAndStartAnimation(
					'boxmoving',box[0],'position',40,speedBox, box[0].position,pickedPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
				)
			}
			else if (sp[0]&&sphere[0].physicsImpostor){
				BABYLON.Engine.audioEngine.audioContext?.resume()
				let s=Number(localStorage.getItem('SpeedSphera'))
				if(!s){s=SpeedSphera}
				sphere[0].physicsImpostor.applyImpulse(new BABYLON.Vector3(0,s*-1,0), sphere[0].getAbsolutePosition())
				if(stopwatch.textContent=='00:00'){startTime=Date.now();countTime=true}
			}
			if (sp[0]&&sp[0].pickedMesh.name=='sphereGlue'){
				const pos=sp[0].pickedMesh.getAbsolutePosition(),mat=sp[0].pickedMesh.material
				sphere.pop();sp[0].pickedMesh.dispose()
				setTimeout(()=>{
					sphere.push(buildSphera(scene,'sphere0',shadowGen))
					sphere[0].position=pos;sphere[0].material=mat
					sphere[0].physicsImpostor.applyImpulse(new BABYLON.Vector3(0,Number(localStorage.getItem('SpeedSphera')),0), sphere[0].getAbsolutePosition())
				})
			}
			
		}
	}
	
	let massMeshs=[]
	buttonPauseGo.onclick = function(){	
		if(massMeshs.length==0){moving=false
			scene.meshes.forEach(i=>{
				if(i._physicsImpostor&&i._physicsImpostor._options.mass!=0){
					massMeshs.push([i.name,i._physicsImpostor._options.mass])
					i.physicsImpostor.setMass(0)
				}
			})
		}
		else{
			moving=true	
			massMeshs.forEach(i=>{scene.getMeshByName(i[0]).physicsImpostor.setMass(i[1])})
			massMeshs=[]
		}
	}
	
	changeSpeedSphera.onchange= function change_speed_sphera(){	
		let oldSpeed=Number(localStorage.getItem('SpeedSphera')),newSpeed=Number(changeSpeedSphera.value),speed=sphere[0].physicsImpostor.getLinearVelocity().length()
		if(((oldSpeed&&oldSpeed!=newSpeed)||(!oldSpeed&&SpeedSphera!=newSpeed))&&speed!=0){
			sphere.forEach(i=>setSpeed(i,newSpeed))
		}
		else if(speed==0){LinearVelocitySpere=LinearVelocitySpere.scale((1/LinearVelocitySpere.length())*newSpeed)}
		localStorage.setItem('SpeedSphera',newSpeed)
	}
	
    return scene;
} 


if(localStorage.getItem('Constructor')==1){
	if(localStorage.getItem('CL')){glob_scene = createConstructor(localStorage.getItem('CL'))}
	else{glob_scene = createConstructor()}
	}
else{glob_scene = createScene()}

engine.runRenderLoop(function () {
	try {glob_scene.render()}
	catch(err) {console.log(195,err)}
});

window.addEventListener("resize", function () {engine.resize()})

buttonRight.onclick = function (){if(!cameraRotateAnim){rotateCamera (glob_scene.cameras[0], -1)}}
buttonLeft.onclick = function (){if(!cameraRotateAnim){rotateCamera (glob_scene.cameras[0], 1)}}
buttonUnblock.onclick = function (){
	if(buttonUnblock.textContent=='🔓'){buttonUnblock.textContent='🔐';camera.attachControl(canvas, true)}
	else{buttonUnblock.textContent='🔓';camera.detachControl(canvas)}
}
buttonCenter.onclick = function (){camera.position=new BABYLON.Vector3(0,15,-50)}

let cameraRotateAnim=null
async function rotateCamera (camera, direction){
	cameraRotateAnim = BABYLON.Animation.CreateAndStartAnimation(
		'cameraRotate',camera,'alpha',60,30, camera.alpha,camera.alpha+Math.PI/4*direction, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
	)
	await cameraRotateAnim.waitAsync()
	cameraRotateAnim=null
}

if(localStorage.getItem('SpeedSphera')&&document.getElementById('changeSpeedSphera')){
	changeSpeedSphera.value=localStorage.getItem('SpeedSphera')
	SpeedSphera=Number(localStorage.getItem('SpeedSphera'))
}

changeLevel.onchange= function change_Level(){
	if(changeLevel.value!='+'&&changeLevel.value[0]!='U'){
		localStorage.setItem('selectedLevel',Number(changeLevel.value))	
		localStorage.setItem('Constructor',0)
	}
	else if(changeLevel.value[0]=='U'){
		localStorage.setItem('selectedLevel',changeLevel.value)	
		localStorage.setItem('Constructor',0)
	}
	else{localStorage.setItem('selectedLevel',changeLevel.value);localStorage.setItem('Constructor',1)}
	window.location.reload()
}

export function setSpeed(mesh,speed){
	const s=mesh.physicsImpostor.getLinearVelocity()	
	mesh.physicsImpostor.setLinearVelocity(s.scale((1/s.length())*speed))
}

function nextLevel(NumLevels,time){
	if(!bestTime||bestTime>time){
		localStorage.setItem('bestTime'+indexLevel,time)
		time<0?BestTime.textContent='-'+new Date(Math.abs(time)).toISOString().slice(-10,-5):BestTime.textContent=new Date(time).toISOString().slice(-10,-5)
	}
	time<0?stopwatch.textContent='-'+new Date(Math.abs(time)).toISOString().slice(-10,-5):stopwatch.textContent=new Date(time).toISOString().slice(-10,-5)	
	if(passedLevel<levels.length-1){
		if(selectedLevel==passedLevel){
			localStorage.setItem('selectedLevel',passedLevel+1);localStorage.setItem('passedLevel',passedLevel+1)
			changeLevel.value=passedLevel+1
			NumLevels[passedLevel+1].disabled=false		
		}
		else(localStorage.setItem('selectedLevel',passedLevel))
	}
}

