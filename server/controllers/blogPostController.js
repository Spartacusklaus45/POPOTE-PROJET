import { BlogPost } from '../models/BlogPost.js';
import { createNotification } from '../services/notificationService.js';

export const createBlogPost = async (req, res) => {
  try {
    const blogPost = new BlogPost({
      ...req.body,
      author: req.user.id
    });

    if (req.body.status === 'PUBLISHED') {
      blogPost.publishedAt = new Date();
    }

    await blogPost.save();
    res.status(201).json(blogPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'article' });
  }
};

export const getAllBlogPosts = async (req, res) => {
  try {
    const { category, tag, status = 'PUBLISHED', page = 1, limit = 10 } = req.query;
    const query = { status };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    const total = await BlogPost.countDocuments(query);
    const blogPosts = await BlogPost.find(query)
      .populate('author', 'name avatar')
      .sort('-publishedAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      posts: blogPosts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
  }
};

export const getBlogPostBySlug = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({
      slug: req.params.slug,
      status: 'PUBLISHED'
    }).populate('author', 'name avatar');

    if (!blogPost) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    await blogPost.incrementViews();
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'article' });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!blogPost) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (req.body.status === 'PUBLISHED' && blogPost.status !== 'PUBLISHED') {
      req.body.publishedAt = new Date();
    }

    Object.assign(blogPost, req.body);
    await blogPost.save();

    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article' });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({
      _id: req.params.id,
      author: req.user.id
    });

    if (!blogPost) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Archiver plutôt que supprimer
    blogPost.status = 'ARCHIVED';
    await blogPost.save();

    res.json({ message: 'Article archivé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
  }
};

export const likeBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    const liked = await blogPost.addLike(req.user.id);
    if (liked) {
      // Notification à l'auteur
      await createNotification({
        user: blogPost.author,
        type: 'BLOG_POST_LIKED',
        title: 'Nouvel like sur votre article',
        message: `Quelqu'un a aimé votre article "${blogPost.title}"`,
        data: { blogPostId: blogPost._id }
      });
    }

    res.json({ likes: blogPost.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du like de l\'article' });
  }
};

export const unlikeBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    await blogPost.removeLike(req.user.id);
    res.json({ likes: blogPost.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du unlike de l\'article' });
  }
};

export const addComment = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    const comment = await blogPost.addComment(req.user.id, req.body.content);

    // Notification à l'auteur
    await createNotification({
      user: blogPost.author,
      type: 'BLOG_POST_COMMENT',
      title: 'Nouveau commentaire sur votre article',
      message: `Quelqu'un a commenté votre article "${blogPost.title}"`,
      data: { blogPostId: blogPost._id, commentId: comment._id }
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire' });
  }
};

export const searchBlogPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Terme de recherche requis' });
    }

    const blogPosts = await BlogPost.find({
      $text: { $search: q },
      status: 'PUBLISHED'
    }, {
      score: { $meta: 'textScore' }
    })
    .populate('author', 'name avatar')
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);

    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la recherche des articles' });
  }
};