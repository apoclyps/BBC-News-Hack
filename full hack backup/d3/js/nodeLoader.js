window.onload=function(){
	/*
var data = {"nodes":[
							{"headline":"Story 1", "summary":"Story 1", "type":1, "assetUri": "www.yahoo.com", "entity":"story", "img_hrefD":"", "img_hrefL":""},
							{"headline":"GGL", "summary":"Story 2", "type":2, "assetUri": "www.google.com", "entity":"story", "img_hrefD":"", "img_hrefL":""},
							{"headline":"BNG", "summary":"Story 3", "type":2, "assetUri": "www.bing.com", "entity":"story", "img_hrefD":"", "img_hrefL":""},
							{"headline":"YDX", "summary":"Story 4", "type":2, "assetUri": "www.yandex.com", "entity":"story", "img_hrefD":"", "img_hrefL":""},
							
							
							{"headline":"YHO", "summary":"Story 5", "type":1, "assetUri": "www.yahoo.com", "entity":"event", "img_hrefD":"", "img_hrefL":""},
							{"headline":"GGL", "summary":"Story 6", "type":2, "assetUri": "www.google.com", "entity":"event", "img_hrefD":"", "img_hrefL":""},
							{"headline":"BNG", "summary":"Story 7", "type":2, "assetUri": "www.bing.com", "entity":"event", "img_hrefD":"", "img_hrefL":""},
							{"headline":"YDX", "summary":"Story 8 ", "type":2, "assetUri": "www.yandex.com", "entity":"event", "img_hrefD":"", "img_hrefL":""},
							{"headline":"YDX", "summary":"Story 9", "type":2, "assetUri": "www.yandex.com", "entity":"story", "img_hrefD":"", "img_hrefL":""},
						], 
				"links":[
							{"source":0,"target":1,"value":1,"distance":5},
							{"source":1,"target":2,"value":1,"distance":5},
							{"source":2,"target":3,"value":1,"distance":5},
							
							
							{"source":3,"target":4,"value":10,"distance":6},
							{"source":4,"target":5,"value":10,"distance":6},
							{"source":5,"target":6,"value":10,"distance":6},
							{"source":6,"target":7,"value":10,"distance":6},
							{"source":7,"target":8,"value":10,"distance":6},							]
				   }    
				   */

$.getJSON( "data.json", function( data ) {

proc(data);
	data = generateJSON();
	alert(data.nodes.headline);
});

function generateJSON(){
    
        var nodes = [];
        var links = [];
        
        
        getSectionIndex("http://www.bbc.co.uk/things/4993e6b8-4214-44eb-9c66-67929058850f", "55e5w5gwnjyfg7z5rd7v8s93");
        

var data = new Array();
    data.push(nodes);
    data.push(links);

    return data;

        function getSectionIndex(section, key) {
                $.ajax({
                 url: "http://euanmorrison.co.uk/newshack/euan/interface.php?url=http://bbc.api.mashery.com/juicer-ld-api/storylines/graphs?uri=" + section + "&api_key=" + key,
                
                 success: function( data ) {
                        extractSectionIndexData(jQuery.parseJSON(data));
                        buildLinks();
                 }
                });
        }
        
        function buildLinks() {
                for (var i = 0; i < nodes.length; i++) {
                        if (i % 2 != 0) {
                                var link = {
                                        source: i,
                                        target: i+1,
                                        value: i,
                                        distance: 5
                                };
                                
                                links.push(link);
                        }
                }
        }
        
        function extractSectionIndexData(data) {
                var graphs = data['@graph'];
                for(var i=0;i < graphs.length; i++)                
                {
                        if (graphs[i]['@type'] === "Event")
                        {
                                var node =
                                {
                                        title: graphs[i].preferredLabel,
                                        eventStartDate: graphs[i].eventStartDate
                                };
                                
                                if (typeof graphs[i].taggedOn != 'undefined')
                                {
                                        var newsitem = graphs[i].taggedOn;
                                        if (newsitem['@type'] === "NewsItem") {
                                                node.newsitem = newsitem['@id'],
                                                node.dateCreated = newsitem.dateCreated,
                                                node.description = newsitem.description;
                                        }
                                }
                                nodes.push(node);
                        }
                }
        }
        
};

function proc(data)
{

		var w = 940,
			h = 500,
			radius = d3.scale.log().domain([0, 312000]).range(["10", "50"]);
		
		var vis = d3.select("body").append("svg:svg")
			.attr("width", w)
			.attr("height", h);
				
			vis.append("defs").append("marker")
			.attr("id", "arrowhead")
			.attr("refX", 22 + 3) /*must be smarter way to calculate shift*/
			.attr("refY", 2)
			.attr("markerWidth", 6)
			.attr("markerHeight", 4)
			.attr("orient", "auto")
			.append("path")
				//.attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead
		
	//	d3.json("data.json", function(error, data) {
	//	});
	    
			var force = self.force = d3.layout.force()
				.nodes(data.nodes)
				.links(data.links)
				.linkDistance(function(d) { return (d.distance*10); })
				//.friction(0.7)
				.charge(-820)
				.gravity(0.1)
				.size([w, h])
				.start();
		
		
			var link = vis.selectAll("line.link")
				.data(data.links)
				.enter().append("svg:line")
				.attr("class", function (d) { return "link" + d.value +""; })
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; })
				.attr("marker-end", function(d) {
													if (d.value == 1) {return "url(#arrowhead)"}
													else    { return " " }
												;});
				
			function openLink() {
				return function(d) {
					var url = "";
					if(d.assetUri != "") {
						url = d.assetUri
					} //else if(d.type == 2) {
						//url = "clients/" + d.assetUri
					//} else if(d.type == 3) {
						//url = "agencies/" + d.assetUri
					//}
					window.open("//"+url)
				}
			}
					
		
			var node = vis.selectAll("g.node")
				.data(data.nodes)
			  .enter().append("svg:g")
				.attr("class", "node")
				.call(force.drag);
		
			
			node.append("circle")
			  	.attr("class", function(d){ return "node type"+d.type})
				.attr("r",function(d){ return 18 })
				//.on("mouseover", expandNode);
				//.style("fill", function(d) { return fill(d.type); })
				
						
		
			node.append("svg:image")
				.attr("class", function(d){ return "circle img_"+d.headline })
				.attr("xlink:href", function(d){ return d.img_hrefD})
				.attr("x", "-36px")
				.attr("y", "-36px")
				.attr("width", "70px")
				.attr("height", "70px")
				.on("click", openLink())
				.on("mouseover", function (d) { if(d.entity == "story")
													{
    					d3.select(this).attr("width", "90px")
					   					.attr("x", "-46px")
										.attr("y", "-36.5px")
									   .attr("xlink:href", function(d){ return d.img_hrefL});							
													}
					})
				.on("mouseout", function (d) { if(d.entity == "story")
												{
    					d3.select(this).attr("width", "70px")
										.attr("x", "-36px")
										.attr("y", "-36px")
									   .attr("xlink:href", function(d){ return d.img_hrefD});
												}
					});    
					
		
			node.append("svg:text")
				.attr("class", function(d){ return "nodetext title_"+d.headline })
				.attr("dx", 0)
				.attr("dy", ".35em")
				.style("font-size","10px")
				.attr("text-anchor", "middle")
				.style("fill", "white")
				.text(function(d) { return d.headline} );

            node.append("svg:text")
				.attr("class", function(d){ return "nodetext title_"+d.headline })
				.attr("dx", "-4em")
				.attr("dy", ".35em")
				.style("font-size","10px")
				.attr("text-anchor", "right")
				.style("fill", "black")
				;
				
				
			node.on("mouseover", function (d) {
            	if (d.entity == "story"){   
					d3.select(this).select('text')
						.transition()
						.duration(300)
						.text(function(d){
								return d.summary;
							})
						.style("font-size","15px")
						
				}
				else if(d.entity == "event"){
					d3.select(this).select('text')
						.transition()
						.duration(300)
						.text(function(d){return d.summary})
						.style("font-size","15px")	
					
				}
				else {
					d3.select(this).select('text')
						.transition()
						.duration(300)
						.style("font-size","15px")
				}
						
		    	if (d.entity == "story") {
					d3.select(this).select('image')
						.attr("width", "90px")
						.attr("x", "-46px")
						.attr("y", "-36.5px")
						.attr("xlink:href", function (d) {
							return d.img_hrefL
		            		});               
		        }
				
				if (d.entity == "story") {
				
					d3.select(this).select('circle')
									.transition()
									.duration(300)
									.attr("r",28)
									
				}
				else if (d.entity == "event"){
					d3.select(this).select('circle')
									.transition()
									.duration(300)
									.attr("r",32)
				}
		 	})
			
			 
			 node.on("mouseout", function (d) {
				if (d.entity == "story") {
					d3.select(this).select('text')
						.transition()
						.duration(300)
						.text(function(d){return d.headline;})
						.style("font-size","10px")
					}
				else if(d.entity == "event"){
					d3.select(this).select('text')
						.transition()
						.duration(300)
						.text(function(d){return d.headline;})
						.style("font-size","10px")	
					
				}
				else {
					d3.select(this).select('text')
						.transition()
						.duration(300)
						.style("font-size","10px")
				}
						
					
				 if (d.entity == "story") {
					d3.select(this).select('image')
						.attr("width", "70px")
						.attr("x", "-36px")
						.attr("y", "-36px")
						.attr("xlink:href", function (d) {
						return d.img_hrefD
					});
				}
				
				if (d.entity == "story" || d.entity == "event") {
				
					d3.select(this).select('circle')
									.transition()
									.duration(300)
									.attr("r",18)
				}
				
			});
			
			force.on("tick", function() {
			  link.attr("x1", function(d) { return d.source.x; })
				  .attr("y1", function(d) { return d.source.y; })
				  .attr("x2", function(d) { return d.target.x; })
				  .attr("y2", function(d) { return d.target.y; });
		
			  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			});
		//});
		
}//]]>  

};
