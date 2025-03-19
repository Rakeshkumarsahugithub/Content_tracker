import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from "axios";
import cron from 'node-cron';


// Initialize the Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/contestTracker');

// Solution schema and model
const solutionSchema = new mongoose.Schema({
  platform: String,
  contestId: String,
  youtubeUrl: String,
});

const Solution = mongoose.model('Solution', solutionSchema);

// Bookmark schema and model
const bookmarkSchema = new mongoose.Schema({
  contestId: String,
  platform: String,
  name: String,
  url: String,
  startTime: Number,
  duration: Number,
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// Route to get all solutions
app.get('/api/solutions', async (req, res) => {
  try {
    const solutions = await Solution.find();
    res.json(solutions);
  } catch (err) {
    res.status(500).send('Error retrieving solutions');
  }
});

// Route to add a new solution
app.post('/api/solutions', async (req, res) => {
  const { platform, contestId, youtubeUrl } = req.body;
  const newSolution = new Solution({ platform, contestId, youtubeUrl });

  try {
    await newSolution.save();
    res.status(200).send('Solution saved');
  } catch (err) {
    res.status(500).send('Error saving solution');
  }
});

// Route to get all bookmarks
app.get('/api/bookmarks', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.json(bookmarks);
  } catch (err) {
    res.status(500).send('Error retrieving bookmarks');
  }
});

// Route to add a new bookmark
app.post('/api/bookmarks', async (req, res) => {
  const { contestId, platform, name, url, startTime, duration } = req.body;
  const newBookmark = new Bookmark({ contestId, platform, name, url, startTime, duration });

  try {
    await newBookmark.save();
    res.status(200).send('Bookmark saved');
  } catch (err) {
    res.status(500).send('Error saving bookmark');
  }
});

// Route to remove a bookmark
app.delete('/api/bookmarks/:contestId', async (req, res) => {
  const { contestId } = req.params;

  try {
    await Bookmark.deleteOne({ contestId });
    res.status(200).send('Bookmark deleted');
  } catch (err) {
    res.status(500).send('Error deleting bookmark');
  }
});

// Function to fetch LeetCode contests
const fetchLeetcodeContests = async () => {
    try {
      const url = "https://leetcode.com/contest/";
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
  
      let contests = [];
      $(".contest-card").each((index, element) => {
        const title = $(element).find(".text-label-1").text().trim();
        const link = "https://leetcode.com" + $(element).find("a").attr("href");
        const startTime = $(element).find(".text-label-2").text().trim();
  
        contests.push({ title, link, startTime });
      });
  
      return contests;
    } catch (error) {
      console.error('Error fetching LeetCode contests:', error);
      return [];
    }
  };
  
  // Function to fetch CodeChef contests (placeholder, since CodeChef requires authentication)
  const fetchCodechefContests = async () => {
    return [];
  };
  
  // **Cron Job: Fetch and store contests every hour**
  cron.schedule("0 * * * *", async () => {
    console.log("Running scheduled task: Fetching contests...");
  
    try {
      const [cfContests, lcContests, ccContests] = await Promise.all([
        fetchCodeforcesContests(),
        fetchLeetcodeContests(),
        fetchCodechefContests(),
      ]);
  
      const allContests = [...cfContests, ...lcContests, ...ccContests];
  
      console.log(`Fetched ${allContests.length} contests.`);
  
      // Store in DB if required (assuming Bookmark model is used for tracking contests)
      await Bookmark.deleteMany({});
      await Bookmark.insertMany(allContests);
  
      console.log("Contests updated in database.");
    } catch (error) {
      console.error("Error updating contests:", error);
    }
  });
  

// **Cron Job: Fetch solutions from YouTube every 6 hours**
const fetchSolutionLinks = async () => {
    const solutionPlaylists = [
      "https://www.youtube.com/playlist?list=PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr", // LeetCode
      "https://www.youtube.com/playlist?list=PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB", // Codeforces
      "https://www.youtube.com/playlist?list=PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr"  // CodeChef
    ];
  
    try {
      for (const playlistUrl of solutionPlaylists) {
        const { data } = await axios.get(playlistUrl);
        const $ = cheerio.load(data);
  
        $(".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer").each(
          async (index, element) => {
            const title = $(element).find(".title-and-badge").text().trim();
            const url = "https://www.youtube.com" + $(element).attr("href");
  
            let platform = "";
            if (playlistUrl.includes("Leetcode")) platform = "leetcode";
            else if (playlistUrl.includes("Codeforces")) platform = "codeforces";
            else if (playlistUrl.includes("CodeChef")) platform = "codechef";
  
            const contestId = title.split(" ")[1]; // Extract contest ID from title
  
            const existingSolution = await Solution.findOne({ contestId, platform });
            if (!existingSolution) {
              await Solution.create({ platform, contestId, youtubeUrl: url });
              console.log(`Saved new solution: ${title}`);
            }
          }
        );
      }
    } catch (error) {
      console.error("Error fetching solution links:", error);
    }
  };
  
  // **Schedule solutions fetch every 6 hours**
  cron.schedule("0 */1 * * *", async () => {
    console.log("Running scheduled task: Fetching YouTube solutions...");
    await fetchSolutionLinks();
    console.log("YouTube solutions updated.");
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

