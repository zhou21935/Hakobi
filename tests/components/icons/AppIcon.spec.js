import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppIcon from '@/components/icons/AppIcon.vue'

describe('AppIcon', () => {
  it.each(['overview', 'agent', 'parcel', 'profile', 'copy'])(
    'renders the %s icon as a decorative current-color SVG',
    (name) => {
      const wrapper = mount(AppIcon, { props: { name } })
      const svg = wrapper.get(`[data-icon="${name}"]`)

      expect(svg.attributes('aria-hidden')).toBe('true')
      expect(svg.classes()).toContain('fill-current')
      expect(svg.get('path').attributes('d')).toBeTruthy()
    }
  )

  it('rejects arbitrary icon names without rendering supplied markup', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(AppIcon, { props: { name: '<script>alert(1)</script>' } })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.html()).not.toContain('<script>')
    expect(warning).toHaveBeenCalled()
  })
})
