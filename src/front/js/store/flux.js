const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		accessToken: null,
		userInfo: null,
		message: null,
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
	  },
	  actions: {
		// Use getActions to call a function within a fuction
  
		apiFetchPublic: async (endpoint, method = "GET", body = null) => {
		  var request;
		  if (method == "GET") {
			request = await fetch(process.env.BACKEND_URL + "/api" + endpoint);
		  } else {
			const params = {
			  method,
			  headers: {
				"Content-Type": "application/json",
			  },
			};
			if (body) params.body = JSON.stringify(body);
			request = fetch(process.env.BACKEND_URL + "/api" + endpoint, params);
		  }
		  const resp = await request;
		  const data = await resp.json();
		  return { code: resp.status, data };
		},
  
		loadTokens: () => {
		  let token = localStorage.getItem("accessToken");
		  setStore({ accessToken: token });
		},
  
		login: async (email, password) => {
		  const { apiFetchPublic } = getActions();
		  const resp = await apiFetchPublic("/login", "POST", {
			email,
			password,
		  });
		  if (resp.code != 200) {
			console.error("Login error");
			return null;
		  }
		  console.log({ resp });
		  const { message, token } = resp.data;
		  localStorage.setItem("accessToken", token);
		  setStore({ accessToken: token });
		  return "Login Successful";
		},
  
		signup: (email, password) => {},
  
		getUserInfo: () => {},
  
		exampleFunction: () => {
		  getActions().changeColor(0, "green");
		},
  
		getMessage: async () => {
		  try {
			// fetching data from the backend
			const { apiFetchPublic } = getActions();
			const data = await apiFetchPublic("/hello");
			setStore({ message: data.data.message });
			// don't forget to return something, that is how the async resolves
			return data;
		  } catch (error) {
			console.log("Error loading message from backend", error);
		  }
		},
  
		changeColor: (index, color) => {
		  //get the store
		  const store = getStore();
  
		  //we have to loop the entire demo array to look for the respective index
		  //and change its color
		  const demo = store.demo.map((elm, i) => {
			if (i === index) elm.background = color;
			return elm;
		  });
  
		  //reset the global store
		  setStore({ demo: demo });
		},
	  },
	};
  };
  
  export default getState;