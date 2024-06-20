// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import { create } from 'ipfs-http-client';

const client = create('https://ipfs.infura.io:5001/api/v0');

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  try {
    const { file } = req;
    const added = await client.add(file.buffer);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: `Failed to upload file to IPFS: ${error.message}` });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};