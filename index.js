const express = require('express')
app = express()
const cors = require("cors")
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv")
dotenv.config()

const port = process.env.PORT || 3000

app.use(express.static('static'))

const uri = 'mongodb+srv://lukecmendiola:ub5SuSPyuVYQYkWX@merna-ma.jo7ugk2.mongodb.net/?retryWrites=true&w=majority&appName=merna-ma'
const client = new MongoClient(uri)

async function setupMongoDB() {
	try {
	  const database = client.db('leaderboard');
	  playerWinsCollection = database.collection('playerWins');
	  const query = { wins: 1 };
	  const wins = await playerWinsCollection.findOne(query);
	  console.log("MongoDB setup complete");
	  console.log(wins)
	} catch (err) {
	  console.error("Error setting up MongoDB:", err);
	}
}




app.get('/Instructor', (req, res) => {

})

app.get('/Class', (req, res) => {
	
})

app.get('/ClassSection', (req, res) => {
	
})
app.get('/ClassSectionAndInstructor', (req, res) => {
	
})


let leaderboard = [];

app.get('/GetLewisTacToeLeaders', (req, res) => {
  // Sort leaderboard data by TotalWins (descending)
  leaderboard.sort((a, b) => b.TotalWins - a.TotalWins);

  // Return only top 3 players
  const topPlayers = leaderboard.slice(0, 3);
  res.json(topPlayers);
});

// POST endpoint to add win or tie for authenticated user
app.post('/AddWinOrTie', (req, res) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  const { name } = req.oidc.user;

  const index = leaderboard.findIndex(player => player.UserName === name);
  if (index !== -1) {
    // Increment the wins or ties for the user
    leaderboard[index].TotalWins += 1;
  } else {
    // If the user is not in the leaderboard, add them with 1 win
    leaderboard.push({ UserName: name, TotalWins: 1 });
  }

  res.status(200).send('Win or tie added successfully.');
});


setupMongoDB();

// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
