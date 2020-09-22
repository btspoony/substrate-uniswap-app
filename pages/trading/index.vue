<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  render: createElement => createElement('div'),
  middleware (ctx) {
    ctx.redirect('/trading/swap')
  }
})
export default class RedirectComponent extends Vue {}
</script>
