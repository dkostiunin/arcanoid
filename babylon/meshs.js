import {setSpeed} from './b_client.js'

export const buildCar = () => {		
	const box = BABYLON.MeshBuilder.CreateBox("box", {width: 3,height: 1,depth: 3})
	const material = new BABYLON.StandardMaterial("bx");
    box.material = material   
	material.diffuseColor = new BABYLON.Color3(0.1, 0.04, 0.9)
 	const capsuleL = new BABYLON.MeshBuilder.CreateCapsule("capsuleL",{height:4,radius:.75})
	capsuleL.material = material;capsuleL.rotation.x = Math.PI/2;capsuleL.position.x=-1.5;
	const capsuleR = capsuleL.clone("capsuleR");
    capsuleR.position.x = 1.5
	const capsuleF = capsuleL.clone("capsuleF"); 
	capsuleF.rotation.y = Math.PI/2;capsuleF.position.z = -1.5;	capsuleF.position.x = 0;
	const capsuleB = capsuleL.clone("capsuleB");
	capsuleB.rotation.y = Math.PI /2;capsuleB.position.z = 1.5;	capsuleB.position.x = 0
	box.addChild(capsuleL);box.addChild(capsuleR);box.addChild(capsuleF); box.addChild(capsuleB); 
	box.position.y =.75;
	box.receiveShadows=true;capsuleL.receiveShadows=true;capsuleR.receiveShadows=true;capsuleF.receiveShadows=true;capsuleB.receiveShadows=true;
    capsuleL.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleL,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleR.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleR,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleF.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleF,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleB.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleB,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0,friction: 0,restitution: 1})
    return [box,capsuleL,capsuleR,capsuleF,capsuleB]	
},

BigBox = () => {	
    const box = BABYLON.MeshBuilder.CreateBox("box", {width: 6,height: 1,depth: 6})
    const material = new BABYLON.StandardMaterial("bx");
    box.material = material   
	material.diffuseColor = new BABYLON.Color3(0.1, 0.04, 0.9);
	material.freeze()
 	const capsuleL = new BABYLON.MeshBuilder.CreateCapsule("capsuleL",{height:7,radius:1})
    capsuleL.material = material
	capsuleL.rotation.x = Math.PI /2
    capsuleL.position.x=-3.5;
	const capsuleR = capsuleL.clone("capsuleR");
    capsuleR.position.x = 3.5
	const capsuleF = capsuleL.clone("capsuleF"); 
	capsuleF.rotation.y = Math.PI /2
	capsuleF.position.z = -3.5;	capsuleF.position.x = 0;
	const capsuleB = capsuleL.clone("capsuleB");
	capsuleB.rotation.y = Math.PI /2
	capsuleB.position.z = 3.5;	capsuleB.position.x = 0;
	box.addChild(capsuleL);box.addChild(capsuleR);box.addChild(capsuleF);box.addChild(capsuleB); 
	box.position.y =1;
	box.receiveShadows=true;capsuleL.receiveShadows=true;capsuleR.receiveShadows=true;capsuleF.receiveShadows=true;capsuleB.receiveShadows=true;
	capsuleL.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleL,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleR.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleR,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleF.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleF,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleB.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleB, BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})  
	box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0,friction: 0,restitution: 1})
    return [box,capsuleL,capsuleR,capsuleF,capsuleB]	
},

MinBox = () => {
    const box = BABYLON.MeshBuilder.CreateBox("box", {width: 1.5,height: .75,depth: 1.5})
    const material = new BABYLON.StandardMaterial("bx");
    box.material = material
	material.diffuseColor = new BABYLON.Color3(0.1, 0.04, 0.9);
	material.freeze()
 	const capsuleL = new BABYLON.MeshBuilder.CreateCapsule("capsuleL",{height:2,radius:0.5})
    capsuleL.material = material
	capsuleL.rotation.x = Math.PI /2
    capsuleL.position.x=-0.75;
	const capsuleR = capsuleL.clone("capsuleR");
    capsuleR.position.x = 0.75
	const capsuleF = capsuleL.clone("capsuleF")	
	capsuleF.rotation.y = Math.PI /2
	capsuleF.position.z = -0.75;capsuleF.position.x = 0;
    const capsuleB = capsuleL.clone("capsuleB");
	capsuleB.rotation.y = Math.PI /2
    capsuleB.position.z =0.75; capsuleB.position.x = 0;
	box.addChild(capsuleL);box.addChild(capsuleR);box.addChild(capsuleF);box.addChild(capsuleB)
	box.position.y =.5;
	box.receiveShadows=true;capsuleL.receiveShadows=true;capsuleR.receiveShadows=true;capsuleF.receiveShadows=true;capsuleB.receiveShadows=true;
	capsuleL.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleL,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleR.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleR,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleF.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleF,BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})
	capsuleB.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleB, BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 0,friction: 0,restitution: 1})  
	box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0,friction: 0,restitution: 1})
	return [box,capsuleL,capsuleR,capsuleF,capsuleB]
},

buildBricks = (qty) => {
	let arr_bricks=[]
	qty.forEach(i=>{
		const box = BABYLON.MeshBuilder.CreateBox(i[0],i[1]),
		material = new BABYLON.StandardMaterial("mat"+i[0])
		box.position=new BABYLON.Vector3(i[2][0],i[2][1],i[2][2])
		material.bumpTexture=new BABYLON.Texture(i[3][0])
		material.diffuseTexture=new BABYLON.Texture(i[3][1])
		box.material = material
		box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor,{mass: 0,restitution: 1,friction: 0})
		box.freezeWorldMatrix();box.convertToUnIndexedMesh()
		arr_bricks.push(box)
	})
	return arr_bricks;
},

buildSphera = (scene,n,shadowGen) => {
	const sphere = BABYLON.Mesh.CreateSphere(n, 8, 2),
		BoxBall = new BABYLON.Sound('BoxBall', '/babylon/sounds/BoxBall.wav', scene, null, {loop: false,autoplay: false}),
		BallWall = new BABYLON.Sound('BallWall', '/babylon/sounds/bip.mp3', scene, null, {loop: false,autoplay: false})
	sphere.position=new BABYLON.Vector3(0, 15, 0)
	sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1,friction: 0, restitution: 1,
	nativeOptions: { linearDamping: 0, angularDamping: 0 }})	
	const M = new BABYLON.StandardMaterial(n);
	M.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	sphere.material=M
	shadowGen.addShadowCaster(sphere);
	sphere.physicsImpostor.onCollideEvent = function(s,t) {
		if(t.object.name!='box'&&t.object.name!='groundDown'){BallWall.play()}
		if(t.object.name!='groundDown'){setTimeout(()=>{setSpeed(sphere,Number(changeSpeedSphera.value))})}
		if(t.object.name=='box'){
			BoxBall.play()			
			if(t.object.material.emissiveTexture&&t.object.material.emissiveTexture.name=='perlin'){
				const meshP=scene.getMeshByName('box'),mat=sphere.material
				sphere.dispose()
				const sp = BABYLON.Mesh.CreateSphere('sphereGlue', 8, 2)
				sp.parent = meshP
				sp.position=new BABYLON.Vector3(0, 1.5, 0);sp.material=mat
			}
		}
		
	}
	return sphere
},

build_ground = () => {
	const groundMat = new BABYLON.StandardMaterial("groundMat"),
    groundDown = BABYLON.MeshBuilder.CreateGround("groundDown", {width:20, height:20});	
	groundDown.visibility = 0.5;	
	const groundTop = groundDown.clone("groundTop");groundTop.position.y=30
	groundTop.rotation.z = Math.PI
	groundTop.material = groundMat;
	const groundTopMat = new BABYLON.StandardMaterial("groundTopMat");
	groundTop.material = groundTopMat;
	groundTopMat.emissiveColor = new BABYLON.Color3(0.5, 0.5,1);
	groundTopMat.disableLighting = true;
    groundTopMat.backFaceCulling = false;
    const noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 128);
    groundTopMat.emissiveTexture = noiseTexture;
    noiseTexture.octaves = 6;
    noiseTexture.persistence = .65;
    noiseTexture.animationSpeedFactor = .1;
    noiseTexture.brightness = .1;
	const groundBack = BABYLON.MeshBuilder.CreateGround("groundBack", {width:20, height:30}),
	yelloMat = new BABYLON.StandardMaterial("yelloMat");
	yelloMat.diffuseColor = new BABYLON.Color3(0.91, 0.91, .91)
	yelloMat.freeze()
    groundBack.material = yelloMat;		
    groundBack.position = new BABYLON.Vector3(0, 15, 10)	
    groundBack.rotation.x = -Math.PI / 2; 
	
	const groundFront = groundBack.clone("groundFront");groundFront.position.z=-10
	const greenMat = new BABYLON.StandardMaterial("greenMat");
	greenMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
    groundFront.material = greenMat;
	groundFront.rotation.x = Math.PI/2; 
	greenMat.freeze()
	groundFront.freezeWorldMatrix();
	const groundLeft = groundBack.clone("groundLeft"),blueMat = new BABYLON.StandardMaterial("blueMat")
	blueMat.emissiveColor  = new BABYLON.Color3(0, 0, 1);
	blueMat.freeze()
    groundLeft.material = blueMat;	
	groundLeft.rotation.y = -Math.PI / 2; groundLeft.position= new BABYLON.Vector3(-10, 15, 0)
	groundLeft.freezeWorldMatrix();
	const groundRight = groundLeft.clone("groundRight");groundRight.position.x=10
	const purpleMat = new BABYLON.StandardMaterial("purpleMat");
	purpleMat.emissiveColor  = new BABYLON.Color3(1, 0, 1);
	purpleMat.freeze()
    groundRight.material = purpleMat;	
	groundRight.rotation.y = Math.PI / 2
	groundRight.freezeWorldMatrix();
	const myColors = [new BABYLON.Color4(0.5, 0.5, 0.5, 1),new BABYLON.Color4(0.5, 0.5, 0.5, 1)]
    
    BABYLON.MeshBuilder.CreateLines("lines", {points: [new BABYLON.Vector3(10, 0, -10),new BABYLON.Vector3(10, 30, -10)],colors: myColors})
	BABYLON.MeshBuilder.CreateLines("lines2", {points: [new BABYLON.Vector3(-10, 0, -10),new BABYLON.Vector3(-10, 30, -10)],colors: myColors})
	BABYLON.MeshBuilder.CreateLines("lines3", {points: [new BABYLON.Vector3(10, 0, 10),new BABYLON.Vector3(10, 30, 10)],colors: myColors})
	BABYLON.MeshBuilder.CreateLines("lines4", {points: [new BABYLON.Vector3(-10, 0, 10),new BABYLON.Vector3(-10, 30, 10)],colors: myColors})
	
	const g=[groundDown,groundBack,groundFront,groundLeft,groundRight,groundTop]
	g.forEach(i=>i.physicsImpostor=new BABYLON.PhysicsImpostor(i,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,restitution:1,friction:0}))
	groundDown.receiveShadows=true;groundFront.receiveShadows=true;groundBack.receiveShadows=true;groundLeft.receiveShadows=true;groundRight.receiveShadows=true;
	
	return g
},

winEffect=(scene)=>{
	const MatCup = new BABYLON.StandardMaterial("MatCup"),
	Win1 = new BABYLON.Sound('GetBonus', '/babylon/sounds/win1.mp3', scene, null, {loop: false,autoplay: false})
	MatCup.diffuseColor = new BABYLON.Color3(0.82, 0.91, 0.08)
	BABYLON.SceneLoader.ImportMesh("","/babylon/scenes/", "trophy2.obj", scene, function (Meshes) {
		Meshes[1].scaling = new BABYLON.Vector3(2, 2, 2);
		Meshes[1].position.y=10
		Meshes[1].material=MatCup
		Win1.play()
		createAndStartAnimationAsync(Meshes[1])
		renderCanvas.insertAdjacentHTML(
				'afterend',`<div id="bbb"><button id="NextLevelButton" onclick="window.location.reload()"><span>Next?</span></button></div>`
			)
		
		const Writer = BABYLON.MeshWriter(scene, {scale:0.05,defaultFont:"Arial"});
		const textMesh  = new Writer( 
			"You Win!",{
				"font-family":"Arial",anchor: "center",
				"letter-height": 55,"letter-thickness": 20,
				colors:{
					diffuse  :"#F0F0F0",
					specular :"black",
					ambient  :"#F0F0F0",
					emissive :"#ff00f0" 
				},
				position: {x:0,y:250,z: 0}
			}
		)
		let mesh=textMesh.getMesh()
		mesh.position.z = -5
		mesh.addRotation(-Math.PI / 2, 0, 0)
		let CoT = new BABYLON.TransformNode("root"); 
		mesh.parent = CoT;
		BABYLON.Animation.CreateAndStartAnimation("flour",CoT, "rotation.y", 30, 120, CoT.rotation.y, CoT.rotation.y-Math.PI*2,
		BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
	})
	const createAndStartAnimationAsync = (result) => {
		return new Promise((resolve) => {
			BABYLON.Animation.CreateAndStartAnimation("bxxx",result, "rotation.y", 30, 120, result.rotation.y, result.rotation.y+Math.PI*2,
			BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, undefined, resolve)
		})
	}
}

export function timeIsOver(scene,moveFloor,BulkBrick){
	
	const createAndStartAnimationAsync = (result) => {
		return new Promise((resolve) => {
			BABYLON.Animation.CreateAndStartAnimation("floorRotate",result, "rotation", 30, 45, new BABYLON.Vector3(0, 0,0),
			new BABYLON.Vector3(0,0,Math.PI/8),BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, undefined, resolve)
			moveFloor.play()
		})
	}
	scene.meshes.forEach(i=>{
		if(i.name.includes('sphere')||i.name=='groundDown'){i.dispose()}
	})
	const floor=scene.getMeshByName("waterDown")
	floor.physicsImpostor = new BABYLON.PhysicsImpostor(floor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1,friction: 0  })
	let CoT = new BABYLON.TransformNode("root1")
	floor.parent = CoT;CoT.position.x=10;floor.position.x=-10	
	scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(0, -10, 0));	
	createAndStartAnimationAsync(CoT).then(()=>{
		scene.meshes.forEach(i=>{if(i.name.includes('brick')==true||i.name=='box'){i.physicsImpostor.setMass(100)}})			
		floor.physicsImpostor.onCollideEvent = function(b,t){if (t.object.name!='box'){BulkBrick.play()}}	
		const Writer = BABYLON.MeshWriter(scene, {scale:0.05,defaultFont:"Arial"});
		const textMesh  = new Writer( 
			"Time's UP",{"font-family":"Arial",anchor: "center","letter-height": 55,"letter-thickness": 20,position: {x:0,y:800,z: 0}}
		);
		let mesh=textMesh.getMesh()
		const fireMaterial = new BABYLON.StandardMaterial("fontainSculptur2"),fireTexture = new BABYLON.FireProceduralTexture("fire", 32);
		fireTexture.speed = new BABYLON.Vector2(1,1)
		fireMaterial.diffuseTexture = fireTexture;    
		mesh.material=fireMaterial		
		mesh.addRotation(-Math.PI / 2, 0, 0)
		let ParentMesh = new BABYLON.TransformNode("root2"); 
		mesh.parent = ParentMesh;
		setTimeout(()=>{
			BABYLON.Animation.CreateAndStartAnimation("ParentMesh",ParentMesh,"rotation.y",15,120,ParentMesh.rotation.y, ParentMesh.rotation.y-Math.PI*2,
			BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			BABYLON.Animation.CreateAndStartAnimation("ParentMesh2",ParentMesh,"position.y",30,120,-5,-25,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
			renderCanvas.insertAdjacentHTML(
				'afterend',`<div id="bbb"><button id="restartButton" onclick="window.location.reload()"><span>Restart?</span></button></div>`
			)
		},500)
	})
}