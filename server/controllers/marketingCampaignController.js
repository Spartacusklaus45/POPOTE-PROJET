import { MarketingCampaign } from '../models/MarketingCampaign.js';
import { User } from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import { sendPushNotification } from '../services/pushNotificationService.js';

export const createCampaign = async (req, res) => {
  try {
    const campaign = new MarketingCampaign(req.body);
    
    // Calculer l'audience cible
    if (campaign.audience.type === 'ALL') {
      campaign.metrics.targetAudience = await User.countDocuments();
    } else if (campaign.audience.type === 'SEGMENT') {
      const query = buildAudienceQuery(campaign.audience);
      campaign.metrics.targetAudience = await User.countDocuments(query);
    }

    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la campagne' });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la campagne' });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la campagne' });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }

    if (campaign.status === 'ACTIVE') {
      return res.status(400).json({ message: 'Impossible de supprimer une campagne active' });
    }

    campaign.status = 'CANCELLED';
    await campaign.save();

    res.json({ message: 'Campagne annulée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la campagne' });
  }
};

export const startCampaign = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }

    if (!campaign.canStart()) {
      return res.status(400).json({ message: 'La campagne ne peut pas être démarrée' });
    }

    // Récupérer l'audience cible
    const query = buildAudienceQuery(campaign.audience);
    const targetUsers = await User.find(query);

    // Envoyer la campagne selon le type
    switch (campaign.type) {
      case 'EMAIL':
        await sendEmailCampaign(campaign, targetUsers);
        break;
      case 'PUSH':
        await sendPushCampaign(campaign, targetUsers);
        break;
      // Ajouter d'autres types de campagnes ici
    }

    campaign.status = 'ACTIVE';
    await campaign.save();

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du démarrage de la campagne' });
  }
};

export const pauseCampaign = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }

    if (campaign.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Seule une campagne active peut être mise en pause' });
    }

    campaign.status = 'PAUSED';
    await campaign.save();

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise en pause de la campagne' });
  }
};

export const getCampaignMetrics = async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }

    const metrics = campaign.calculateMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des métriques' });
  }
};

export const trackCampaignEvent = async (req, res) => {
  try {
    const { campaignId, type, userId } = req.body;
    const campaign = await MarketingCampaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }

    await campaign.updateMetrics(type);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du suivi de l\'événement' });
  }
};

// Fonctions utilitaires

function buildAudienceQuery(audience) {
  const query = {};

  if (audience.filters) {
    if (audience.filters.location?.length) {
      query['address.city'] = { $in: audience.filters.location };
    }

    if (audience.filters.ageRange) {
      const today = new Date();
      const minBirthDate = new Date(today.getFullYear() - audience.filters.ageRange.max, today.getMonth(), today.getDate());
      const maxBirthDate = new Date(today.getFullYear() - audience.filters.ageRange.min, today.getMonth(), today.getDate());
      
      query.birthDate = {
        $gte: minBirthDate,
        $lte: maxBirthDate
      };
    }

    if (audience.filters.lastOrderDate) {
      query.lastOrderDate = { $gte: audience.filters.lastOrderDate };
    }

    if (audience.filters.orderCount) {
      query.orderCount = { $gte: audience.filters.orderCount };
    }

    if (audience.filters.totalSpent) {
      query.totalSpent = { $gte: audience.filters.totalSpent };
    }

    if (audience.filters.interests?.length) {
      query.interests = { $in: audience.filters.interests };
    }
  }

  if (audience.excludedUsers?.length) {
    query._id = { $nin: audience.excludedUsers };
  }

  return query;
}

async function sendEmailCampaign(campaign, users) {
  for (const user of users) {
    try {
      await sendEmail({
        to: user.email,
        subject: campaign.content.subject,
        html: replacePlaceholders(campaign.content.body, user)
      });
      await campaign.updateMetrics('sent');
      await campaign.updateMetrics('delivered');
    } catch (error) {
      await campaign.updateMetrics('bounced');
      console.error(`Erreur d'envoi d'email à ${user.email}:`, error);
    }
  }
}

async function sendPushCampaign(campaign, users) {
  for (const user of users) {
    if (user.pushToken) {
      try {
        await sendPushNotification({
          token: user.pushToken,
          title: campaign.content.title,
          body: replacePlaceholders(campaign.content.body, user),
          data: {
            campaignId: campaign._id.toString(),
            action: campaign.content.callToAction?.url
          }
        });
        await campaign.updateMetrics('sent');
        await campaign.updateMetrics('delivered');
      } catch (error) {
        await campaign.updateMetrics('bounced');
        console.error(`Erreur d'envoi de notification à ${user._id}:`, error);
      }
    }
  }
}

function replacePlaceholders(content, user) {
  return content
    .replace(/\{firstName\}/g, user.firstName || '')
    .replace(/\{lastName\}/g, user.lastName || '')
    .replace(/\{email\}/g, user.email || '')
    .replace(/\{city\}/g, user.address?.city || '');
}