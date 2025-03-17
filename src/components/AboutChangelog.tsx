function AboutChangelog() {
  const logData = [
    {
      versionName: "First Look Demo",
      date: "2025/02/28",
      features: [
        {
          content:
            "Published a working version of Explore page with Parallel Coordinate Chart, Scatter Plot, Filtered University List, and University Detail",
        },
        {
          content: "Figma prototype of Compare page",
          link: "https://www.figma.com/proto/bgJ0AXKdBu74e9c9TK0aKD/Studyability_v2.0?node-id=475-882&p=f&t=AHYHMP88DvdfTUlO-0&scaling=scale-down&content-scaling=fixed&page-id=1%3A1424&starting-point-node-id=276%3A856",
        },
      ],
    },
    {
      versionName: "Final Presentation",
      date: "2025/03/10",
      feedbacks: [
        {
          source: "Mentimeter",
          link: "https://www.mentimeter.com/app/presentation/al7oiqz8ytoaoxufox9ckdwyyp5z86vx/view?question=kv1hpghdhq21",
          comments: [
            "Color adjustments of Parallel Coordinate Chart in Explore page to indicate pre-filtered selection",
            "Ability to adjust add/remove attributes of Spider Chart in Compare page",
          ],
        },
      ],
      features: [
        {
          content:
            "Published a working version of Compare page with Radial Bar Chart, Comparison Table, Spider Chart, and Multiple Bar Charts",
        },
        {
          content:
            "Changed the layout for Explore page (Parallel Chart and Scatter Plot on top)",
        },
        {
          content: "Updated the map into light colors",
        },
        {
          content:
            "Connected interaction of Scatter Plot <-> Map <-> University Summary <-> Filtered List in Explore page",
        },
        {
          content:
            "Updated the Filtered University List to show how many universities are displayed",
        },
        {
          content: "Changed the layout for University Detail",
        },
        {
          content: "All universities have geolocations",
        },
        {
          content: "Display website data for ~58% of universities",
        },
        {
          content: "Fixed null data for temperatures",
        },
      ],
    },
    {
      versionName: "Final Deliverable",
      date: "2025/03/19",
      feedbacks: [
        {
          source: "Mentimeter",
          link: "https://www.mentimeter.com/app/presentation/alstbmq9mh9n3b76fmo9yw5qztbwh3cu/view?question=9rqg4bzsecwx",
          comments: [
            "Provided data definitions for attributes shown in Explore page",
            "Provided data definitions for attributes shown in Compare page",
            "Added description about legend in Radial Bar Chart in Compare page",
            "Provided a way to describe the icons in Comparison Table in Compare page",
            "Feedback from discussion in Final Presentation",
            "Make the title of Multiple Bar Chart more readable",
          ],
        },
      ],
      features: [
        {
          content:
            "Published About page explaining the project overview, the team, how to use, data sources, and relevant references",
        },

        {
          content: "Fixed data for missing cities",
        },
      ],
    },
  ];
  return (
    <>
      {logData.map(({ versionName, date, features, feedbacks }, index) => (
        <div key={`${date}`}>
          <h3>
            {versionName} ( {date} )
          </h3>
          {feedbacks && (
            <div>
              {feedbacks.map((feedback) => (
                <div key={feedback.source}>
                  Feedback from{" "}
                  {feedback.link ? (
                    <a target="_blank" href={feedback.link}>
                      {feedback.source}
                    </a>
                  ) : (
                    <span>{feedback.source}</span>
                  )}
                  :
                  <ul>
                    {feedback.comments.map((comment) => (
                      <li key={comment}>{comment}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {features && (
            <div>
              {" "}
              {index > 0 ? "Feature Updates" : "Features"}
              <ul>
                {features.map((feature) => (
                  <li key={feature.content}>
                    {feature.link ? (
                      <a href={feature.link} target="_blank">
                        {feature.content}
                      </a>
                    ) : (
                      <span>{feature.content}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default AboutChangelog;
