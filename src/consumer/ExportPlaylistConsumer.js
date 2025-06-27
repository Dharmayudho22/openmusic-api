require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('../services/playlists');
const MailSender = require('../services/MailSender');
const ClientError = require('../exceptions/ClientError');
const config = require('../utils/config');
const autoBind = require('auto-bind');

class ExportPlaylistConsumer {
  constructor() {
    this._playlistsService = new PlaylistsService();
    this._mailSender = new MailSender();
    autoBind(this);
    this.start();
  }

  async start() {
    try {
      const connection = await amqp.connect(config.rabbitMq.server);
      const channel = await connection.createChannel();

      await channel.assertQueue('export:playlists', {
        durable: true,
      });

      console.log('Consumer berjalan, menunggu pesan...');

      channel.consume('export:playlists', async (message) => {
        try {
          const { playlistId, targetEmail } = JSON.parse(message.content.toString());
          console.log(`Menerima permintaan ekspor playlist ${playlistId} ke ${targetEmail}`);

          const playlistData = await this._playlistsService.getPlaylistDetailForExport(playlistId);
          const content = JSON.stringify(playlistData, null, 2);

          await this._mailSender.sendEmail(targetEmail, content);

          channel.ack(message);
          console.log(`Playlist ${playlistId} berhasil diekspor ke ${targetEmail}`);
        } catch (error) {
          console.error('Error saat memproses pesan RabbitMQ:', error.message);
          if (error instanceof ClientError) {
            console.error('Client error during export:', error.message);
            channel.ack(message); 
          } else {
            console.error('Server error during export, requeueing:', error.message);
            channel.reject(message, false); 
          }
        }
      });
    } catch (error) {
      console.error('Gagal terhubung ke RabbitMQ:', error.message);
      process.exit(1);
    }
  }
}

new ExportPlaylistConsumer();