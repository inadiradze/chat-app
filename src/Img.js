import React, { useState, useEffect } from "react";
import "./style.css";

function Img(props) {

	const [image, setImage] = useState("");

	useEffect( () => {
		const reader = new FileReader();
		reader.readAsDataURL(props.blob);
		reader.onload = () => {
			setImage(reader.result);
			
		}
	}, [props.blob]);

	return (
		<img className="img" src={image}></img>
		);

};

export default Img;