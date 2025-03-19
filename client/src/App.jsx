

// // Fetch Codeforces contests
// const fetchCodeforces = async () => {
//   const response = await fetch('https://codeforces.com/api/contest.list');
//   const data = await response.json();
//   return data.result
//     .filter((c) => c.phase !== 'FINISHED')
//     .map((c) => ({
//       id: `cf-${c.id}`,
//       platform: 'codeforces',
//       name: c.name,
//       startTime: c.startTimeSeconds * 1000,
//       duration: c.durationSeconds,
//       url: `https://codeforces.com/contests/${c.id}`,
//     }));
// };

// // Placeholder for CodeChef fetch
// const fetchCodechef = async () => {
//   return [];
// };

// // Placeholder for LeetCode fetch
// const fetchLeetcode = async () => {
//   return [];
// };




//import React, { useState, useEffect } from 'react';
// import ContestCard from './ContestCard';
// import Filter from './Filter';
// import './App.css';

// // Define the platforms
// const PLATFORMS = ['codeforces', 'codechef', 'leetcode'];

// const App = () => {
//   const [contests, setContests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState([...PLATFORMS]);
//   const [bookmarks, setBookmarks] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [solutionData, setSolutionData] = useState({
//     platform: '',
//     contestId: '',
//     youtubeUrl: '',
//   });
//   const [solutions, setSolutions] = useState([]);
//   const [activeTab, setActiveTab] = useState('upcoming'); // New state for active tab

//   // Toggle theme
//   const toggleTheme = () => {
//     document.body.dataset.theme =
//       document.body.dataset.theme === 'dark' ? 'light' : 'dark';
//     localStorage.setItem('theme', document.body.dataset.theme);
//   };

//   // Open and close modal
//   const handleModalOpen = () => setIsModalOpen(true);
//   const handleModalClose = () => setIsModalOpen(false);

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         const [cfContests, ccContests, lcContests] = await Promise.all([
//           fetchCodeforces(),
//           fetchCodechef(),
//           fetchLeetcode(),
//         ]);
//         const allContests = [...cfContests, ...ccContests, ...lcContests].sort(
//           (a, b) => a.startTime - b.startTime
//         );
//         setContests(allContests);

//         const bookmarksResponse = await fetch('http://localhost:5000/api/bookmarks');
//         const bookmarksData = await bookmarksResponse.json();
//         setBookmarks(bookmarksData.map((b) => b.contestId));

//         const solutionsResponse = await fetch('http://localhost:5000/api/solutions');
//         const solutionsData = await solutionsResponse.json();
//         setSolutions(solutionsData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Toggle bookmark
//   const toggleBookmark = async (contestId) => {
//     const contest = contests.find((c) => c.id === contestId);
//     if (!contest) return;

//     const isBookmarked = bookmarks.includes(contestId);

//     try {
//       if (isBookmarked) {
//         await fetch(`http://localhost:5000/api/bookmarks/${contestId}`, {
//           method: 'DELETE',
//         });
//         setBookmarks((prev) => prev.filter((id) => id !== contestId));
//         alert(`Removed bookmark for contest: ${contest.name}`);
//       } else {
//         await fetch('http://localhost:5000/api/bookmarks', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             contestId: contest.id,
//             platform: contest.platform,
//             name: contest.name,
//             url: contest.url,
//             startTime: contest.startTime,
//             duration: contest.duration,
//           }),
//         });
//         setBookmarks((prev) => [...prev, contestId]);
//         alert(`Bookmarked contest: ${contest.name}`);
//       }
//     } catch (error) {
//       console.error('Error toggling bookmark:', error);
//     }
//   };

//   // Handle solution submission
//   const handleSolutionSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/solutions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(solutionData),
//       });

//       if (response.ok) {
//         const solutionsResponse = await fetch('http://localhost:5000/api/solutions');
//         const updatedSolutions = await solutionsResponse.json();
//         setSolutions(updatedSolutions);

//         setSolutionData({ platform: '', contestId: '', youtubeUrl: '' });
//         setIsModalOpen(false);
//       }
//     } catch (error) {
//       console.error('Error saving solution:', error);
//     }
//   };

//   // Render contests
//   const renderContests = () => {
//     const now = Date.now();
//     const filtered = contests.filter((c) => filters.includes(c.platform));

//     const upcoming = filtered.filter((c) => c.startTime > now);
//     const past = filtered.filter((c) => c.startTime <= now);

//     return (
//       <div>
//         {activeTab === 'upcoming' && (
//           <>
//             <h2>Upcoming Contests</h2>
//             <div className="contest-grid">
//               {upcoming.map((contest) => (
//                 <ContestCard
//                   key={contest.id}
//                   contest={contest}
//                   isBookmarked={bookmarks.includes(contest.id)}
//                   toggleBookmark={toggleBookmark}
//                   isPast={false}
//                 />
//               ))}
//             </div>
//           </>
//         )}

//         {activeTab === 'past' && (
//           <>
//             <h2>Past Contests</h2>
//             <div className="contest-grid">
//               {past.map((contest) => (
//                 <ContestCard
//                   key={contest.id}
//                   contest={contest}
//                   isBookmarked={bookmarks.includes(contest.id)}
//                   toggleBookmark={toggleBookmark}
//                   isPast={true}
//                 />
//               ))}
//             </div>
//           </>
//         )}

//         {activeTab === 'solutions' && renderSolutions()}
//       </div>
//     );
//   };

//   // Render saved solutions with improved design
//   const renderSolutions = () => {
//     if (solutions.length === 0) {
//       return <p className="no-solutions">No solutions saved yet.</p>;
//     }

//     return (
//       <div className="solutions-section">
//         <h2>Solutions</h2>
//         <div className="solutions-grid">
//           {solutions.map((solution, index) => (
//             <div key={index} className="solution-card">
//               <div className="solution-header">
//                 <span className={`platform-icon ${solution.platform}`}>
//                   {solution.platform.charAt(0).toUpperCase()}
//                 </span>
//                 <h3>{solution.platform}</h3>
//               </div>
//               <div className="solution-body">
//                 <p><strong>Contest ID:</strong> {solution.contestId}</p>
//                 <p>
//                   <strong>YouTube URL:</strong>{' '}
//                   <a href={solution.youtubeUrl} target="_blank" rel="noopener noreferrer">
//                     Watch Solution
//                   </a>
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         <h1>Contest Tracker</h1>
//         <button className="theme-toggle" onClick={toggleTheme}>
//         🌞Light/Dark🌙 
//         </button>
//         <button className="admin-panel" onClick={handleModalOpen}>
//           Admin Panel
//         </button>
//       </div>

//       <Filter filters={filters} setFilters={setFilters} />

//       <div className="view-toggle">
//         <button
//           className={`toggle-button ${activeTab === 'upcoming' ? 'active' : ''}`}
//           onClick={() => setActiveTab('upcoming')}
//         >
//           Upcoming Contests
//         </button>
//         <button
//           className={`toggle-button ${activeTab === 'past' ? 'active' : ''}`}
//           onClick={() => setActiveTab('past')}
//         >
//           Past Contests
//         </button>
//         <button
//           className={`toggle-button ${activeTab === 'solutions' ? 'active' : ''}`}
//           onClick={() => setActiveTab('solutions')}
//         >
//           Solutions
//         </button>
//       </div>

//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading contests...</p>
//         </div>
//       ) : (
//         <div className="contest-grid">
//           {contests.map((contest) => (
//             <ContestCard key={contest.id} contest={contest} />
//           ))}
//         </div>
//       )}
//       {renderContests()}

//       {/* Admin Modal */}
//       {isModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Admin Panel</h2>
//             <form onSubmit={handleSolutionSubmit}>
//               <div className="form-group">
//                 <label>Platform</label>
//                 <select
//                   value={solutionData.platform}
//                   onChange={(e) =>
//                     setSolutionData({ ...solutionData, platform: e.target.value })
//                   }
//                   required
//                 >
//                   <option value="">Select Platform</option>
//                   {PLATFORMS.map((platform) => (
//                     <option key={platform} value={platform}>
//                       {platform.charAt(0).toUpperCase() + platform.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Contest ID</label>
//                 <input
//                   type="text"
//                   value={solutionData.contestId}
//                   onChange={(e) =>
//                     setSolutionData({ ...solutionData, contestId: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>YouTube URL</label>
//                 <input
//                   type="url"
//                   value={solutionData.youtubeUrl}
//                   onChange={(e) =>
//                     setSolutionData({ ...solutionData, youtubeUrl: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <button type="submit">Send Solution</button>
//               <button type="button" onClick={handleModalClose}>
//                 Close
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Fetch Codeforces contests
// const fetchCodeforces = async () => {
//   const response = await fetch('https://codeforces.com/api/contest.list');
//   const data = await response.json();
//   return data.result
//     .filter((c) => c.phase === 'BEFORE' || c.phase === 'FINISHED')
//     .map((c) => ({
//       id: `${c.id}`,
//       platform: 'codeforces',
//       name: c.name,
//       startTime: c.startTimeSeconds * 1000,
//       duration: c.durationSeconds,
//       url: `https://codeforces.com/contests/${c.id}`,
//     }));
// };

// // Placeholder for CodeChef fetch
// const fetchCodechef = async () => {
//   // const response = await fetch('https://codechef.com/api/contest.list');
//   // const data = await response.json();
//   // return data.result
//   //   .filter((c) => c.phase === 'BEFORE' || c.phase === 'FINISHED')
//   //   .map((c) => ({
//   //     id: `${c.id}`,
//   //     platform: 'codechef',
//   //     name: c.name,
//   //     startTime: c.startTimeSeconds * 1000,
//   //     duration: c.durationSeconds,
//   //     url: `https://codechef.com/contests/${c.id}`,
//   //   }));
//   return [];
// };

// // Placeholder for LeetCode fetch
// const fetchLeetcode = async () => {
//   return [];
// };

// export default App;



import React, { useState, useEffect } from 'react';
import ContestCard from './ContestCard';
import Filter from './Filter';
import './App.css';

const PLATFORMS = ['codeforces', 'codechef', 'leetcode'];

const App = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState([...PLATFORMS]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solutionData, setSolutionData] = useState({
    platform: '',
    contestId: '',
    youtubeUrl: '',
  });
  const [solutions, setSolutions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Toggle theme
  const toggleTheme = () => {
    document.body.dataset.theme =
      document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
  };

  // Open and close modal
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [cfContests, ccContests, lcContests] = await Promise.all([
          fetchCodeforces(),
          fetchCodechef(),
          fetchLeetcode(),
        ]);
        
        const allContests = [...cfContests, ...ccContests, ...lcContests].sort(
          (a, b) => a.startTime - b.startTime
        );
        setContests(allContests);

        const [bookmarksResponse, solutionsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/bookmarks'),
          fetch('http://localhost:5000/api/solutions')
        ]);
        
        const bookmarksData = await bookmarksResponse.json();
        const solutionsData = await solutionsResponse.json();
        
        setBookmarks(bookmarksData.map((b) => b.contestId));
        setSolutions(solutionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Toggle bookmark
  const toggleBookmark = async (contestId) => {
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) return;

    const isBookmarked = bookmarks.includes(contestId);

    try {
      if (isBookmarked) {
        await fetch(`http://localhost:5000/api/bookmarks/${contestId}`, {
          method: 'DELETE',
        });
        setBookmarks((prev) => prev.filter((id) => id !== contestId));
        alert(`Removed bookmark for contest: ${contest.name}`);
      } else {
        await fetch('http://localhost:5000/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contestId: contest.id,
            platform: contest.platform,
            name: contest.name,
            url: contest.url,
            startTime: contest.startTime,
            duration: contest.duration,
          }),
        });
        setBookmarks((prev) => [...prev, contestId]);
        alert(`Bookmarked contest: ${contest.name}`);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Handle solution submission
  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solutionData),
      });

      if (response.ok) {
        const solutionsResponse = await fetch('http://localhost:5000/api/solutions');
        const updatedSolutions = await solutionsResponse.json();
        setSolutions(updatedSolutions);
        setSolutionData({ platform: '', contestId: '', youtubeUrl: '' });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving solution:', error);
    }
  };

  // Render contests
  const renderContests = () => {
    const now = Date.now();
    const filtered = contests.filter((c) => filters.includes(c.platform));

    const upcoming = filtered.filter((c) => c.startTime > now);
    const past = filtered.filter((c) => c.startTime <= now);

    return (
      <div>
        {activeTab === 'upcoming' && (
          <>
            <h2>Upcoming Contests</h2>
            <div className="contest-grid">
              {upcoming.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isBookmarked={bookmarks.includes(contest.id)}
                  toggleBookmark={toggleBookmark}
                  isPast={false}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'past' && (
          <>
            <h2>Past Contests</h2>
            <div className="contest-grid">
              {past.map((contest) => {
                const solution = solutions.find((s) => s.contestId === contest.id);
                return (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    isBookmarked={bookmarks.includes(contest.id)}
                    toggleBookmark={toggleBookmark}
                    isPast={true}
                    solutionUrl={solution?.youtubeUrl}
                  />
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'solutions' && renderSolutions()}
      </div>
    );
  };

  // Render saved solutions
  const renderSolutions = () => {
    if (solutions.length === 0) {
      return <p className="no-solutions">No solutions saved yet.</p>;
    }

    return (
      <div className="solutions-section">
        <h2>Solutions</h2>
        <div className="solutions-grid">
          {solutions.map((solution, index) => (
            <div key={index} className="solution-card">
              <div className="solution-header">
                <span className={`platform-icon ${solution.platform}`}>
                  {solution.platform.charAt(0).toUpperCase()}
                </span>
                <h3>{solution.platform}</h3>
              </div>
              <div className="solution-body">
                <p><strong>Contest ID:</strong> {solution.contestId}</p>
                <p>
                  <strong>YouTube URL:</strong>{' '}
                  <a href={solution.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    Watch Solution
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Contest Tracker</h1>
        <div className="header-buttons">
          <button className="theme-toggle" onClick={toggleTheme}>
            🌞Light/Dark🌙
          </button>
          <button className="admin-panel" onClick={handleModalOpen}>
            Admin Panel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading contests...</p>
        </div>
      ) : (
        <>
          <Filter filters={filters} setFilters={setFilters} />
          
          <div className="view-toggle">
            <button
              className={`toggle-button ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Contests
            </button>
            <button
              className={`toggle-button ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past Contests
            </button>
            <button
              className={`toggle-button ${activeTab === 'solutions' ? 'active' : ''}`}
              onClick={() => setActiveTab('solutions')}
            >
              Solutions
            </button>
          </div>

          {renderContests()}
        </>
      )}

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Admin Panel</h2>
            <form onSubmit={handleSolutionSubmit}>
              <div className="form-group">
                <label>Platform</label>
                <select
                  value={solutionData.platform}
                  onChange={(e) => setSolutionData({ ...solutionData, platform: e.target.value })}
                  required
                >
                  <option value="">Select Platform</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Contest ID</label>
                <input
                  type="text"
                  value={solutionData.contestId}
                  onChange={(e) => setSolutionData({ ...solutionData, contestId: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>YouTube URL</label>
                <input
                  type="url"
                  value={solutionData.youtubeUrl}
                  onChange={(e) => setSolutionData({ ...solutionData, youtubeUrl: e.target.value })}
                  required
                />
              </div>
              <button type="submit">Send Solution</button>
              <button type="button" onClick={handleModalClose}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Fetch Codeforces contests
const fetchCodeforces = async () => {
  try {
    const response = await fetch('https://codeforces.com/api/contest.list');
    const data = await response.json();
    return data.result
      .filter((c) => c.phase === 'BEFORE' || c.phase === 'FINISHED')
      .map((c) => ({
        id: `${c.id}`,
        platform: 'codeforces',
        name: c.name,
        startTime: c.startTimeSeconds * 1000,
        duration: c.durationSeconds,
        url: `https://codeforces.com/contests/${c.id}`,
      }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

// Placeholder for CodeChef fetch
const fetchCodechef = async () => {
  return [];
};

// Placeholder for LeetCode fetch
const fetchLeetcode = async () => {
  return [];
};

export default App;