const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/newBlog', (req,res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'Blog title is required' });
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: 'Blog body is required' });
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Blog creator is required' });
                } else {
                    const blog = new Blog({
                    title: req.body.title,
                    body: req.body.body,
                    createdBy: req.body.createdBy
                    });
                    
                    blog.save((err) => {
                        if (err) {
                            if (err.errors) {
                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message });
                                } else {
                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message });
                                    } else {
                                        res.json({ success: false, message: err.errmsg });
                                    }
                                }
                            }
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, message: 'Blog saved' });
                        }
                    });
                }
            }
        }
    })

    router.get('/allBlogs', (req,res) => {
        Blog.find({}, (err,blogs) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!blogs) {
                    res.json({ success: false, message: 'No blogs found' });
                } else {
                    res.json({ success: true, blogs: blogs });
                }
            }
        }).sort({ '_id': -1 });
    });

   router.get('/singleBlog/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'No Blog ID was provided.' }); // Return error message
    } else {
      // Check if the blog id is found in database
      Blog.findOne({ _id: req.params.id }, (err, blog) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!blog) {
            res.json({ success: false, message: 'Blog not found.' }); // Return error message
          } else {
            // Find the current user that is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error
              } else {
                // Check if username was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
                } else {
                  // Check if the user who requested single blog is the one who created it
                  if (user.username !== blog.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to eidt this blog.' }); // Return authentication reror
                  } else {
                    res.json({ success: true, blog: blog }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  });

    router.put('/updateBlog', (req,res) => {
        if (!req.body._id) {
            res.json({ success: false, message: 'No Blog ID was provided' });
        } else {
            Blog.findOne({ _id: req.body._id },(err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Not valid Blog ID' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog ID not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this post' });
                                    } else {
                                        blog.title = req.body.title;
                                        blog.body = req.body.body;
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err });
                                            } else {
                                                res.json({ success: true, message: 'Blog updated!' });
                                            }
                                        });

                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.delete('/deleteBlog/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'No Blog ID was provided' });
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Not valid Blog ID' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog ID not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                             if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                  if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                     if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this post' });
                                    } else {
                                        blog.remove((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err });
                                            } else {
                                                res.json({ success: true, message: 'Blog deleted!' });
                                            }
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    })    

    router.put('/likeBlog', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No Blog ID was provided' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid Blog Id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'That blog was not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId}, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                      if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Can not like your own post' });
                                    } else {
                                        if (blog.likedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You are already like this post' });
                                        } else {
                                            if (blog.dislikedBy.includes(user.username)) {
                                                blog.dislikes--;
                                                const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                                blog.dislikedBy.splice(arrayIndex, 1);
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog liked!' });
                                                    }
                                                });
                                            } else {
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog liked!' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                           
                        });
                    }
                }
            });
        }
    });

    router.put('/dislikeBlog', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No Blog ID was provided' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid Blog Id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'That blog was not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId}, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                      if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Can not dislike your own post' });
                                    } else {
                                        if (blog.dislikedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You are already dislike this post' });
                                        } else {
                                            if (blog.likedBy.includes(user.username)) {
                                                blog.likes--;
                                                const arrayIndex = blog.likedBy.indexOf(user.username);
                                                blog.likedBy.splice(arrayIndex, 1);
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog disliked!' });
                                                    }
                                                });
                                            } else {
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: err });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog disliked!' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                           
                        });
                    }
                }
            });
        }
    });

    return router;
};