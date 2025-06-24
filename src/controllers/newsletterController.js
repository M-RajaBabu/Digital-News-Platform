const { Newsletter, NewsletterTemplate } = require('../models');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email, firstName, lastName, preferences } = req.body;
    
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Valid email is required',
        status: 400
      });
    }

    // Check if already subscribed
    const existingSubscription = await Newsletter.findOne({
      where: { email }
    });

    if (existingSubscription) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email is already subscribed to newsletter',
        status: 409
      });
    }

    // Create newsletter subscription
    const subscription = await Newsletter.create({
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      preferences: preferences || {
        categories: [],
        frequency: 'daily',
        format: 'html'
      },
      isActive: true,
      subscribedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscription: {
        id: subscription.id,
        email: subscription.email,
        preferences: subscription.preferences
      }
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to subscribe to newsletter',
      status: 500
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email, token } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Email is required',
        status: 400
      });
    }

    const subscription = await Newsletter.findOne({
      where: { email }
    });

    if (!subscription) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Newsletter subscription not found',
        status: 404
      });
    }

    // In a real implementation, validate the unsubscribe token
    // if (token !== subscription.unsubscribeToken) {
    //   return res.status(403).json({
    //     error: 'Forbidden',
    //     message: 'Invalid unsubscribe token',
    //     status: 403
    //   });
    // }

    await subscription.update({
      isActive: false,
      unsubscribedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to unsubscribe from newsletter',
      status: 500
    });
  }
};

// Update newsletter preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { email } = req.params;
    const { preferences } = req.body;
    
    const subscription = await Newsletter.findOne({
      where: { email }
    });

    if (!subscription) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Newsletter subscription not found',
        status: 404
      });
    }

    await subscription.update({
      preferences: {
        ...subscription.preferences,
        ...preferences
      }
    });

    res.json({
      success: true,
      message: 'Newsletter preferences updated successfully',
      preferences: subscription.preferences
    });
  } catch (error) {
    console.error('Update newsletter preferences error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update newsletter preferences',
      status: 500
    });
  }
};

// Get newsletter templates (admin only)
exports.getTemplates = async (req, res) => {
  try {
    const templates = await NewsletterTemplate.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      templates: templates.map(template => ({
        id: template.id,
        name: template.name,
        subject: template.subject,
        description: template.description,
        isActive: template.isActive
      }))
    });
  } catch (error) {
    console.error('Get newsletter templates error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch newsletter templates',
      status: 500
    });
  }
};

// Send newsletter (admin only)
exports.sendNewsletter = async (req, res) => {
  try {
    const { templateId, subject, content, categories, sendTo } = req.body;
    
    // In a real implementation, this would:
    // 1. Get subscribers based on categories and preferences
    // 2. Generate personalized content
    // 3. Send emails via email service
    // 4. Track delivery and open rates
    
    const subscribers = await Newsletter.findAll({
      where: { isActive: true }
    });

    // Mock sending process
    const sentCount = subscribers.length;
    
    res.json({
      success: true,
      message: `Newsletter sent to ${sentCount} subscribers`,
      sentCount,
      scheduledAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send newsletter',
      status: 500
    });
  }
};

// Get newsletter statistics (admin only)
exports.getStats = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.count({
      where: { isActive: true }
    });

    const recentSubscriptions = await Newsletter.count({
      where: {
        subscribedAt: {
          [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalSubscribers,
        recentSubscriptions,
        activeSubscribers: totalSubscribers,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get newsletter stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch newsletter statistics',
      status: 500
    });
  }
}; 