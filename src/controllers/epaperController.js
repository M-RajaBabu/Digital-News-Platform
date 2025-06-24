const { EPaper, EPaperEdition } = require('../models');

// Get e-paper editions
exports.getEditions = async (req, res) => {
  try {
    const { date, city } = req.query;
    
    const whereClause = {};
    if (date) {
      whereClause.date = date;
    }
    
    const editions = await EPaperEdition.findAll({
      where: whereClause,
      include: [
        {
          model: EPaper,
          as: 'epapers',
          where: city ? { city } : {},
          required: false
        }
      ],
      order: [['date', 'DESC']],
      limit: 30
    });

    res.json({
      success: true,
      editions: editions.map(edition => ({
        date: edition.date,
        cities: edition.epapers.map(epaper => ({
          name: epaper.city,
          pages: epaper.pages,
          downloadUrl: epaper.downloadUrl,
          fileSize: epaper.fileSize,
          isAvailable: epaper.isAvailable
        }))
      }))
    });
  } catch (error) {
    console.error('Get e-paper editions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch e-paper editions',
      status: 500
    });
  }
};

// Get specific e-paper edition
exports.getEdition = async (req, res) => {
  try {
    const { date, city } = req.params;
    
    const edition = await EPaper.findOne({
      where: { date, city },
      include: [
        {
          model: EPaperEdition,
          as: 'edition'
        }
      ]
    });

    if (!edition) {
      return res.status(404).json({
        error: 'Not found',
        message: 'E-paper edition not found',
        status: 404
      });
    }

    res.json({
      success: true,
      edition: {
        date: edition.date,
        city: edition.city,
        pages: edition.pages,
        downloadUrl: edition.downloadUrl,
        fileSize: edition.fileSize,
        isAvailable: edition.isAvailable,
        metadata: edition.metadata
      }
    });
  } catch (error) {
    console.error('Get e-paper edition error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch e-paper edition',
      status: 500
    });
  }
};

// Download e-paper (track download)
exports.downloadEdition = async (req, res) => {
  try {
    const { date, city } = req.params;
    const userId = req.user?.id;
    
    const edition = await EPaper.findOne({
      where: { date, city, isAvailable: true }
    });

    if (!edition) {
      return res.status(404).json({
        error: 'Not found',
        message: 'E-paper edition not available',
        status: 404
      });
    }

    // Track download
    await edition.increment('downloadCount');
    
    // Log user download if authenticated
    if (userId) {
      // Add to user's download history
      // This would require a new model for tracking downloads
    }

    res.json({
      success: true,
      downloadUrl: edition.downloadUrl,
      message: 'Download link generated successfully'
    });
  } catch (error) {
    console.error('Download e-paper error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process download',
      status: 500
    });
  }
}; 