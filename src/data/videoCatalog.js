export const videoCatalog = [
  { id: 'aurora', title: 'Chasing the Northern Lights in Iceland', creator: 'Maya Chen', views: '128K views · 2 hours ago', color: 'aurora', category: 'Travel', duration: '18:42', description: 'A quiet journey beneath the dancing northern lights, filmed across three winter nights in Iceland.' },
  { id: 'studio', title: 'Building a cozy creative studio', creator: 'Frame by Frame', views: '64K views · 5 hours ago', color: 'studio', category: 'Design', duration: '12:08', description: 'A small room, a few warm lights, and a creative space made from scratch.' },
  { id: 'jazz', title: 'Sunday jazz cafe — live mix', creator: 'Vinyl Hours', views: 'Live now · 2.4K watching', color: 'jazz', category: 'Music', live: true, description: 'Slow Sunday jazz and a friendly listening room. Join the live chat.' },
  { id: 'recipe', title: 'A slow morning and the perfect pancakes', creator: 'Sofia Cooks', views: '42K views · yesterday', color: 'recipe', category: 'Lifestyle', duration: '09:31', description: 'An easy, cozy breakfast recipe for a weekend morning.' },
  { id: 'ocean', title: 'Beneath the blue: a quiet ocean film', creator: 'Open Water', views: '91K views · 2 days ago', color: 'ocean', category: 'Travel', duration: '21:16', description: 'Drift through a brilliant underwater world in this short visual story.' },
  { id: 'sketch', title: 'One sketch a day changed my practice', creator: 'Niko Draws', views: '37K views · 3 days ago', color: 'sketch', category: 'Design', duration: '14:05', description: 'A practical look at building a sustainable daily drawing habit.' },
]

export const liveStreams = videoCatalog.filter((video) => video.live)
