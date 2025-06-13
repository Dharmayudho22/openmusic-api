const { nanoid } = require('nanoid');
const pool = require('../database/postgres');

const logActivity = async (playlistId, songId, userId, action) => {
  const id = `activity-${nanoid(16)}`;
  const time = new Date().toISOString();

  await pool.query(
    'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, playlistId, songId, userId, action, time]
  );
};

const getPlaylistActivities = async (playlistId) => {
  const result = await pool.query(
    `SELECT users.username, songs.title, psa.action, psa.time
     FROM playlist_song_activities psa
     JOIN users ON psa.user_id = users.id
     JOIN songs ON psa.song_id = songs.id
     WHERE psa.playlist_id = $1
     ORDER BY psa.time ASC`,
    [playlistId]
  );

  return result.rows;
};

module.exports = { logActivity, getPlaylistActivities };
