export const BrickTestures = (bonus) => {
	const expandingBrick = new BABYLON.StandardMaterial("expandingBrick");	
	expandingBrick.bumpTexture = new BABYLON.Texture("/babylon/textures/brick9.jpg");
	expandingBrick.diffuseTexture = new BABYLON.Texture("/babylon/textures/expand.svg");	
	const squeezeBrick = expandingBrick.clone()
	squeezeBrick.diffuseTexture = new BABYLON.Texture("/babylon/textures/squeeze.svg");
	const rocketBrick = expandingBrick.clone()
	rocketBrick.diffuseTexture = new BABYLON.Texture("/babylon/textures/rocket.svg");
	const brakePedal = expandingBrick.clone()
	brakePedal.diffuseTexture = new BABYLON.Texture("/babylon/textures/brakePedal.svg")
	const FlyBrick = expandingBrick.clone()
	FlyBrick.diffuseTexture = new BABYLON.Texture("/babylon/textures/wings.svg")
	const Glue = expandingBrick.clone()
	Glue.diffuseTexture = new BABYLON.Texture("/babylon/textures/glue.svg")
	const threeBalls = expandingBrick.clone()
	threeBalls.diffuseTexture = new BABYLON.Texture("/babylon/textures/threeBalls.svg")
	const BallsDown = expandingBrick.clone()
	BallsDown.diffuseTexture = new BABYLON.Texture("/babylon/textures/BallsDown.svg")
	const shield = expandingBrick.clone()
	shield.diffuseTexture = new BABYLON.Texture("/babylon/textures/shield.svg")
	const bonuses=[expandingBrick,squeezeBrick,rocketBrick,brakePedal,FlyBrick,Glue,threeBalls,BallsDown,shield].filter((i,j)=>(bonus.includes(j)||bonus.includes((j).toString())))
	return bonuses
},
GoldTextures = () => {
	const GoldBrick1 = new BABYLON.StandardMaterial("GoldBrick");
	GoldBrick1.bumpTexture = new BABYLON.Texture("/babylon/textures/brick9.jpg");
	const woodTexture = new BABYLON.WoodProceduralTexture("fire", 512);
	woodTexture.ampScale = 5.0;
	woodTexture.woodColor  = new BABYLON.Color3(0.82, 0.91, 0.08);
	GoldBrick1.diffuseTexture = woodTexture;
	const GoldBrick2= GoldBrick1.clone()		
	const woodTexture2 = new BABYLON.WoodProceduralTexture("fire2", 512);
	woodTexture2.ampScale = 20.0;
	woodTexture2.woodColor  = new BABYLON.Color3(0.82, 0.91, 0.08);
	GoldBrick2.diffuseTexture = woodTexture2;
	return [GoldBrick1,GoldBrick2]
},
IceTextures = () => {
	const icemat1 = new BABYLON.StandardMaterial("icemat1");
	icemat1.diffuseTexture = new BABYLON.Texture("/babylon/textures/iceFloes1.jpg");
	const icemat2 = new BABYLON.StandardMaterial("icemat1");
	icemat2.diffuseTexture = new BABYLON.Texture("/babylon/textures/iceFloes2.jpg");
	const icemat3 = new BABYLON.StandardMaterial("icemat1");
	icemat3.diffuseTexture = new BABYLON.Texture("/babylon/textures/iceFloes3.jpg");
	return [icemat1,icemat2,icemat3]
},
SilverTextures = () => {
	const SilverT = new BABYLON.StandardMaterial("BreakSilver");
	SilverT.diffuseTexture = new BABYLON.Texture("/babylon/textures/stone.jpg");
	return [SilverT]
}