// commonmark
$.get('https://raw.githubusercontent.com/jgm/commonmark.js/master/dist/commonmark.js', function(data) {
   eval(data);
});

//  githubUser = githubUser ? githubUser : githubUserDefault


var blog={};

function init (data){
  blog['repo']=data
  blog['treeUrl']=repositoryTreeUrl()
  $.get(repositoryTreeUrl(),insertContent)

  return blog;
}

function insertContent(data){
  blog['branch']=data
  blog['paths']=blog.branch.tree.filter(filterBlogItems).map(retrieveContent)
  console.log('ready')
  removeBlogTemplate();
}

function repositoryMasterUrl(){
  return  `https://api.github.com/repos/${githubUser}/${githubRepository}/branches/master`
}

function repositoryTreeUrl(){
  return  `https://api.github.com/repos/${githubUser}/${githubRepository}/git/trees/${blog.repo.commit.sha}?recursive=1`
}

function retrieveContent(object){
  var url = `https://raw.githubusercontent.com/${githubUser}/${githubRepository}/master/${object.path}`
$.get(url,updateSections)
}


function removeBlogTemplate(){
  $(document).ajaxStop(function() {
  $('section#blog:first').next('section#Divide:first').remove()
  $('section#blog:first').remove()
  });
}

function updateSections(data){
  var reader = new commonmark.Parser();
  var writer = new commonmark.HtmlRenderer();
  var parsed = reader.parse(data);
  var result = writer.render(parsed)

$('<section></section>').attr('id','blog').html(result).insertAfter('section#blog:last')
$('section#Divide').first().clone().insertBefore('section#blog:last')

}


function filterBlogItems(object){
  var regex = `${githubFolder}\/(.+)`
  if (object.path.match(regex)){return object; }
}

$.get(repositoryMasterUrl(githubUser),init)
