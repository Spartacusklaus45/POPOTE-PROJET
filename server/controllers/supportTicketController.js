import { SupportTicket } from '../models/SupportTicket.js';
import { createNotification } from '../services/notificationService.js';

export const createTicket = async (req, res) => {
  try {
    const ticket = new SupportTicket({
      ...req.body,
      user: req.user.id,
      metadata: {
        browser: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    await ticket.save();

    // Notification aux agents de support
    await createNotification({
      type: 'NEW_SUPPORT_TICKET',
      title: 'Nouveau ticket de support',
      message: `Nouveau ticket ${ticket.priority} : ${ticket.subject}`,
      data: { ticketId: ticket._id }
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du ticket' });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name')
      .populate('messages.sender', 'name');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    // Vérifier l'accès
    if (ticket.user.toString() !== req.user.id && !req.user.isSupport) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du ticket' });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const { status, category } = req.query;
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tickets' });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { content, attachments, isInternal } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    // Vérifier l'accès
    if (ticket.user.toString() !== req.user.id && !req.user.isSupport) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Vérifier si l'utilisateur peut envoyer des messages internes
    if (isInternal && !req.user.isSupport) {
      return res.status(403).json({ message: 'Non autorisé à envoyer des messages internes' });
    }

    await ticket.addMessage(req.user.id, content, attachments, isInternal);

    // Notification au destinataire
    const notificationRecipient = req.user.id === ticket.user.toString() 
      ? ticket.assignedTo 
      : ticket.user;

    if (notificationRecipient) {
      await createNotification({
        user: notificationRecipient,
        type: 'SUPPORT_TICKET_MESSAGE',
        title: 'Nouveau message sur votre ticket',
        message: `Nouveau message sur le ticket : ${ticket.subject}`,
        data: { ticketId: ticket._id }
      });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du message' });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    if (!req.user.isSupport) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    ticket.status = status;
    await ticket.save();

    // Notification à l'utilisateur
    await createNotification({
      user: ticket.user,
      type: 'SUPPORT_TICKET_STATUS',
      title: 'Mise à jour de votre ticket',
      message: `Le statut de votre ticket a été mis à jour : ${status}`,
      data: { ticketId: ticket._id }
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    if (!req.user.isSupport) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    ticket.assignedTo = assignedTo;
    await ticket.save();

    // Notification à l'agent assigné
    await createNotification({
      user: assignedTo,
      type: 'SUPPORT_TICKET_ASSIGNED',
      title: 'Nouveau ticket assigné',
      message: `Vous avez été assigné au ticket : ${ticket.subject}`,
      data: { ticketId: ticket._id }
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'assignation du ticket' });
  }
};

export const resolveTicket = async (req, res) => {
  try {
    const { solution } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    if (!req.user.isSupport) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await ticket.resolve(req.user.id, solution);

    // Notification à l'utilisateur
    await createNotification({
      user: ticket.user,
      type: 'SUPPORT_TICKET_RESOLVED',
      title: 'Ticket résolu',
      message: 'Votre ticket a été résolu. Merci de nous donner votre avis !',
      data: { ticketId: ticket._id }
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la résolution du ticket' });
  }
};

export const submitSatisfaction = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await ticket.submitSatisfaction(rating, comment);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la soumission de l\'évaluation' });
  }
};