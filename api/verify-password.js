export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed' 
    });
  }

  try {
    const { password } = req.body;

    // Secure server-side comparison
    if (password === 'buccdrop') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid access code.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error' 
    });
  }
}